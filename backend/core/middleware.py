import logging
import time
import json
from django.http import HttpResponseForbidden, JsonResponse
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.conf import settings
from authentication.models import SecurityEvent, LoginSession
from django.utils import timezone
from datetime import datetime, timedelta
import re
import hashlib
from urllib.parse import urlparse

User = get_user_model()
logger = logging.getLogger('security')

class SecurityEventMiddleware(MiddlewareMixin):
    """Middleware to log security events and detect suspicious activity"""
    
    SENSITIVE_PATHS = [
        '/admin/',
        '/api/auth/',
        '/api/users/',
        '/api/superadmin/',
        '/api/billing/',
        '/api/patients/',
    ]
    
    SUSPICIOUS_PATTERNS = [
        r'\.\./',  # Directory traversal
        r'<script',  # XSS attempt
        r'union.*select',  # SQL injection
        r'exec\(',  # Code execution
        r'eval\(',  # Code evaluation
        r'javascript:',  # JavaScript injection
    ]
    
    def process_request(self, request):
        # Record request start time
        request._security_start_time = time.time()
        
        # Get client information
        ip_address = self.get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')[:500]
        
        # Check for suspicious patterns in request
        if self.detect_suspicious_activity(request):
            self.log_security_event(
                user=getattr(request, 'user', None),
                event_type='SUSPICIOUS_ACTIVITY',
                severity='HIGH',
                description=f'Suspicious request pattern detected: {request.path}',
                ip_address=ip_address,
                user_agent=user_agent,
                metadata={
                    'path': request.path,
                    'method': request.method,
                    'query_params': dict(request.GET),
                }
            )
            return HttpResponseForbidden('Suspicious activity detected')
        
        # Rate limiting check
        if self.is_rate_limited(request, ip_address):
            self.log_security_event(
                user=getattr(request, 'user', None),
                event_type='RATE_LIMIT_EXCEEDED',
                severity='MEDIUM',
                description=f'Rate limit exceeded for IP: {ip_address}',
                ip_address=ip_address,
                user_agent=user_agent
            )
            return JsonResponse(
                {'error': 'Rate limit exceeded. Please try again later.'},
                status=429
            )
        
        return None
    
    def process_response(self, request, response):
        # Calculate response time
        if hasattr(request, '_security_start_time'):
            response_time = time.time() - request._security_start_time
            
            # Log slow requests
            if response_time > 5.0:  # 5 seconds
                logger.warning(f'Slow request: {request.path} took {response_time:.2f}s')
        
        # Log access to sensitive data
        if self.is_sensitive_path(request.path) and hasattr(request, 'user') and request.user.is_authenticated:
            self.log_security_event(
                user=request.user,
                event_type='DATA_ACCESS',
                severity='LOW',
                description=f'Access to sensitive path: {request.path}',
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')[:500],
                metadata={
                    'status_code': response.status_code,
                    'response_time': response_time if hasattr(request, '_security_start_time') else None,
                }
            )
        
        return response
    
    def get_client_ip(self, request):
        """Get real client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    def detect_suspicious_activity(self, request):
        """Detect suspicious request patterns"""
        # Check URL path
        path = request.path.lower()
        query_string = request.META.get('QUERY_STRING', '').lower()
        
        # Check for malicious patterns
        for pattern in self.SUSPICIOUS_PATTERNS:
            if re.search(pattern, path + query_string, re.IGNORECASE):
                return True
        
        # Check for unusual request sizes
        content_length = request.META.get('CONTENT_LENGTH')
        if content_length and int(content_length) > 50 * 1024 * 1024:  # 50MB
            return True
        
        # Check for unusual headers
        suspicious_headers = ['x-forwarded-host', 'x-original-url', 'x-rewrite-url']
        for header in suspicious_headers:
            if request.META.get(f'HTTP_{header.upper().replace("-", "_")}'):
                return True
        
        return False
    
    def is_sensitive_path(self, path):
        """Check if path contains sensitive data"""
        return any(sensitive in path for sensitive in self.SENSITIVE_PATHS)
    
    def is_rate_limited(self, request, ip_address):
        """Check if request should be rate limited"""
        if not getattr(settings, 'RATELIMIT_ENABLE', False):
            return False
        
        # Different limits for different endpoints
        if '/api/auth/login/' in request.path:
            return self.check_rate_limit(f'login:{ip_address}', 10, 300)  # 10 per 5 minutes
        elif '/api/auth/' in request.path:
            return self.check_rate_limit(f'auth:{ip_address}', 30, 300)  # 30 per 5 minutes
        elif '/api/' in request.path:
            return self.check_rate_limit(f'api:{ip_address}', 1000, 3600)  # 1000 per hour
        
        return False
    
    def check_rate_limit(self, key, limit, window):
        """Check rate limit using sliding window"""
        current_time = int(time.time())
        pipe = cache.client.get_client().pipeline()
        
        # Remove old entries
        pipe.zremrangebyscore(key, 0, current_time - window)
        # Add current request
        pipe.zadd(key, {current_time: current_time})
        # Count requests in window
        pipe.zcard(key)
        # Set expiry
        pipe.expire(key, window)
        
        results = pipe.execute()
        request_count = results[2]
        
        return request_count > limit
    
    def log_security_event(self, user, event_type, severity, description, ip_address, user_agent, metadata=None):
        """Log security event to database and file"""
        try:
            SecurityEvent.objects.create(
                user=user if user and user.is_authenticated else None,
                event_type=event_type,
                severity=severity,
                description=description,
                ip_address=ip_address,
                user_agent=user_agent,
                metadata=metadata or {}
            )
            
            # Also log to file for immediate analysis
            logger.info(json.dumps({
                'event_type': event_type,
                'severity': severity,
                'description': description,
                'user': user.username if user and user.is_authenticated else 'anonymous',
                'ip_address': ip_address,
                'timestamp': timezone.now().isoformat(),
                'metadata': metadata or {}
            }))
        except Exception as e:
            logger.error(f'Failed to log security event: {e}')

class RateLimitMiddleware(MiddlewareMixin):
    """Advanced rate limiting middleware"""
    
    def process_request(self, request):
        if not getattr(settings, 'RATELIMIT_ENABLE', False):
            return None
        
        ip_address = self.get_client_ip(request)
        user_id = request.user.id if hasattr(request, 'user') and request.user.is_authenticated else None
        
        # Check global rate limit
        if self.is_globally_rate_limited(ip_address, user_id):
            return JsonResponse(
                {'error': 'Global rate limit exceeded'},
                status=429
            )
        
        # Check endpoint-specific rate limits
        endpoint_limit = self.get_endpoint_rate_limit(request.path)
        if endpoint_limit and self.is_endpoint_rate_limited(request, endpoint_limit):
            return JsonResponse(
                {'error': f'Endpoint rate limit exceeded: {endpoint_limit["limit"]} requests per {endpoint_limit["window"]} seconds'},
                status=429
            )
        
        return None
    
    def get_client_ip(self, request):
        """Get real client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    def is_globally_rate_limited(self, ip_address, user_id):
        """Check global rate limits"""
        # IP-based global limit
        ip_key = f'global_ip:{ip_address}'
        if self.check_rate_limit(ip_key, 5000, 3600):  # 5000 per hour
            return True
        
        # User-based global limit
        if user_id:
            user_key = f'global_user:{user_id}'
            if self.check_rate_limit(user_key, 10000, 3600):  # 10000 per hour
                return True
        
        return False
    
    def get_endpoint_rate_limit(self, path):
        """Get rate limit configuration for specific endpoint"""
        endpoint_limits = {
            '/api/auth/login/': {'limit': 10, 'window': 300},
            '/api/auth/register/': {'limit': 5, 'window': 300},
            '/api/auth/password-reset/': {'limit': 3, 'window': 300},
            '/api/billing/': {'limit': 1000, 'window': 3600},
            '/api/patients/': {'limit': 2000, 'window': 3600},
            '/api/appointments/': {'limit': 500, 'window': 3600},
        }
        
        for endpoint, limit in endpoint_limits.items():
            if endpoint in path:
                return limit
        
        return None
    
    def is_endpoint_rate_limited(self, request, limit_config):
        """Check endpoint-specific rate limit"""
        ip_address = self.get_client_ip(request)
        user_id = request.user.id if hasattr(request, 'user') and request.user.is_authenticated else None
        
        # Create unique key for this endpoint
        endpoint_hash = hashlib.md5(request.path.encode()).hexdigest()[:8]
        
        if user_id:
            key = f'endpoint:{endpoint_hash}:user:{user_id}'
        else:
            key = f'endpoint:{endpoint_hash}:ip:{ip_address}'
        
        return self.check_rate_limit(key, limit_config['limit'], limit_config['window'])
    
    def check_rate_limit(self, key, limit, window):
        """Check rate limit using Redis sliding window"""
        try:
            current_time = int(time.time())
            pipe = cache.client.get_client().pipeline()
            
            # Remove old entries
            pipe.zremrangebyscore(key, 0, current_time - window)
            # Add current request
            pipe.zadd(key, {current_time: current_time})
            # Count requests in window
            pipe.zcard(key)
            # Set expiry
            pipe.expire(key, window)
            
            results = pipe.execute()
            request_count = results[2]
            
            return request_count > limit
        except Exception as e:
            logger.error(f'Rate limit check failed: {e}')
            return False  # Fail open

class SessionSecurityMiddleware(MiddlewareMixin):
    """Enhanced session security middleware"""
    
    def process_request(self, request):
        if not hasattr(request, 'user') or not request.user.is_authenticated:
            return None
        
        # Check session validity
        session_id = request.session.session_key
        if session_id:
            try:
                login_session = LoginSession.objects.get(
                    session_id=session_id,
                    user=request.user,
                    is_active=True
                )
                
                # Check if session is expired
                if login_session.is_expired():
                    self.invalidate_session(request, login_session, 'Session expired')
                    return JsonResponse({'error': 'Session expired'}, status=401)
                
                # Check for session hijacking
                current_ip = self.get_client_ip(request)
                if login_session.ip_address != current_ip:
                    # Log potential session hijacking
                    SecurityEvent.objects.create(
                        user=request.user,
                        event_type='SUSPICIOUS_ACTIVITY',
                        severity='HIGH',
                        description=f'IP address mismatch for session. Original: {login_session.ip_address}, Current: {current_ip}',
                        ip_address=current_ip,
                        session_id=session_id,
                        requires_action=True
                    )
                    
                    self.invalidate_session(request, login_session, 'IP address mismatch')
                    return JsonResponse({'error': 'Session security violation'}, status=401)
                
                # Update last activity
                login_session.last_activity = timezone.now()
                login_session.save()
                
                # Check concurrent sessions limit
                if self.check_concurrent_sessions(request.user):
                    return JsonResponse({'error': 'Too many concurrent sessions'}, status=429)
                
            except LoginSession.DoesNotExist:
                # Session not found, force logout
                return JsonResponse({'error': 'Invalid session'}, status=401)
        
        return None
    
    def get_client_ip(self, request):
        """Get real client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    def invalidate_session(self, request, login_session, reason):
        """Invalidate a login session"""
        login_session.is_active = False
        login_session.logout_time = timezone.now()
        login_session.save()
        
        # Clear Django session
        request.session.flush()
        
        logger.warning(f'Session invalidated for user {request.user.username}: {reason}')
    
    def check_concurrent_sessions(self, user):
        """Check if user has too many concurrent sessions"""
        max_sessions = getattr(settings, 'MAX_CONCURRENT_SESSIONS', 3)
        
        active_sessions = LoginSession.objects.filter(
            user=user,
            is_active=True,
            expires_at__gt=timezone.now()
        ).count()
        
        return active_sessions > max_sessions

class HIPAAComplianceMiddleware(MiddlewareMixin):
    """HIPAA compliance middleware for audit logging"""
    
    PHI_ENDPOINTS = [
        '/api/patients/',
        '/api/ehr/',
        '/api/appointments/',
        '/api/billing/',
        '/api/lab/',
        '/api/radiology/',
    ]
    
    def process_request(self, request):
        # Check if accessing PHI data
        if self.is_phi_access(request.path) and hasattr(request, 'user') and request.user.is_authenticated:
            # Log PHI access
            SecurityEvent.objects.create(
                user=request.user,
                event_type='DATA_ACCESS',
                severity='LOW',
                description=f'PHI data access: {request.path}',
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')[:500],
                metadata={
                    'endpoint': request.path,
                    'method': request.method,
                    'phi_access': True,
                }
            )
        
        return None
    
    def is_phi_access(self, path):
        """Check if path involves PHI data access"""
        return any(phi_endpoint in path for phi_endpoint in self.PHI_ENDPOINTS)
    
    def get_client_ip(self, request):
        """Get real client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class PerformanceMiddleware(MiddlewareMixin):
    """Performance monitoring middleware"""
    
    def process_request(self, request):
        request._performance_start = time.time()
        return None
    
    def process_response(self, request, response):
        if hasattr(request, '_performance_start'):
            duration = time.time() - request._performance_start
            
            # Add performance headers
            response['X-Response-Time'] = f'{duration:.3f}s'
            
            # Log slow queries
            if duration > 2.0:  # 2 seconds
                logger.warning(f'Slow request: {request.path} - {duration:.3f}s')
            
            # Track performance metrics
            if hasattr(settings, 'PROMETHEUS_METRICS_ENABLED') and settings.PROMETHEUS_METRICS_ENABLED:
                from django_prometheus.models import RequestsTotal
                RequestsTotal.objects.increment(
                    method=request.method,
                    status=response.status_code,
                    view='unknown'
                )
        
        return response