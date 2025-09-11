from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Enum, JSON, Numeric
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from datetime import datetime

Base = declarative_base()

class TriageLevel(enum.Enum):
    LEVEL_1 = "LEVEL_1"  # Immediate (Red) - Life threatening
    LEVEL_2 = "LEVEL_2"  # Emergent (Orange) - High risk
    LEVEL_3 = "LEVEL_3"  # Urgent (Yellow) - Moderate risk
    LEVEL_4 = "LEVEL_4"  # Less Urgent (Green) - Low risk
    LEVEL_5 = "LEVEL_5"  # Non-urgent (Blue) - Very low risk

class VisitStatus(enum.Enum):
    REGISTERED = "REGISTERED"
    TRIAGED = "TRIAGED"
    WAITING = "WAITING"
    IN_TREATMENT = "IN_TREATMENT"
    ADMITTED = "ADMITTED"
    DISCHARGED = "DISCHARGED"
    TRANSFERRED = "TRANSFERRED"
    LEFT_AMA = "LEFT_AMA"  # Left Against Medical Advice
    LWBS = "LWBS"  # Left Without Being Seen
    DECEASED = "DECEASED"

class AlertType(enum.Enum):
    CODE_BLUE = "CODE_BLUE"  # Cardiac arrest
    CODE_RED = "CODE_RED"  # Fire emergency
    CODE_GRAY = "CODE_GRAY"  # Combative person
    CODE_SILVER = "CODE_SILVER"  # Weapon/hostage
    TRAUMA_ALERT = "TRAUMA_ALERT"  # Major trauma
    STROKE_ALERT = "STROKE_ALERT"  # Stroke protocol
    STEMI_ALERT = "STEMI_ALERT"  # Heart attack
    SEPSIS_ALERT = "SEPSIS_ALERT"  # Sepsis protocol
    MASS_CASUALTY = "MASS_CASUALTY"  # Multiple casualties
    PANDEMIC = "PANDEMIC"  # Infectious disease outbreak

class EmergencyVisit(Base):
    __tablename__ = "emergency_visits"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, nullable=False, index=True)
    visit_number = Column(String(50), unique=True, nullable=False)
    
    # Arrival information
    arrival_time = Column(DateTime, default=func.now(), nullable=False)
    arrival_mode = Column(String(20))  # Walk-in, Ambulance, Helicopter, etc.
    chief_complaint = Column(Text)
    
    # Triage information
    triage_level = Column(Enum(TriageLevel), index=True)
    triage_time = Column(DateTime)
    triage_nurse_id = Column(Integer)
    triage_notes = Column(Text)
    
    # Visit status
    status = Column(Enum(VisitStatus), default=VisitStatus.REGISTERED, index=True)
    
    # Key timestamps
    registration_time = Column(DateTime, default=func.now())
    first_provider_time = Column(DateTime)  # Door-to-doctor time
    treatment_start_time = Column(DateTime)
    disposition_time = Column(DateTime)
    departure_time = Column(DateTime)
    
    # Clinical information
    assigned_doctor_id = Column(Integer)
    assigned_nurse_id = Column(Integer)
    assigned_bed_id = Column(Integer)
    
    # Disposition
    disposition = Column(String(50))  # Discharged, Admitted, Transferred, etc.
    disposition_destination = Column(String(200))
    discharge_instructions = Column(Text)
    
    # Quality metrics
    pain_score_initial = Column(Integer)  # 0-10 scale
    pain_score_final = Column(Integer)
    satisfaction_score = Column(Integer)  # 1-5 scale
    
    # Administrative
    insurance_verified = Column(Boolean, default=False)
    financial_clearance = Column(Boolean, default=False)
    
    # Metadata
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    vital_signs = relationship("VitalSigns", back_populates="visit")
    triage_assessments = relationship("TriageAssessment", back_populates="visit")
    emergency_alerts = relationship("EmergencyAlert", back_populates="visit")

class TriageAssessment(Base):
    __tablename__ = "triage_assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    visit_id = Column(Integer, ForeignKey("emergency_visits.id"), nullable=False)
    assessor_id = Column(Integer, nullable=False)
    
    # Assessment details
    assessment_time = Column(DateTime, default=func.now())
    triage_level = Column(Enum(TriageLevel), nullable=False)
    
    # Clinical assessment
    airway_status = Column(String(20))  # Clear, Compromised, Obstructed
    breathing_status = Column(String(20))  # Normal, Labored, Absent
    circulation_status = Column(String(20))  # Normal, Compromised, Absent
    disability_status = Column(String(20))  # Alert, Verbal, Pain, Unresponsive
    
    # Vital signs at triage
    systolic_bp = Column(Integer)
    diastolic_bp = Column(Integer)
    heart_rate = Column(Integer)
    respiratory_rate = Column(Integer)
    temperature = Column(Numeric(4, 1))
    oxygen_saturation = Column(Integer)
    
    # Pain assessment
    pain_score = Column(Integer)  # 0-10 scale
    pain_location = Column(String(200))
    
    # Mental status
    glasgow_coma_scale = Column(Integer)  # 3-15 scale
    mental_status = Column(String(50))
    
    # Presenting symptoms
    symptoms = Column(JSON)  # List of symptoms
    mechanism_of_injury = Column(Text)
    
    # Risk factors
    high_risk_factors = Column(JSON)
    allergies = Column(Text)
    current_medications = Column(Text)
    medical_history = Column(Text)
    
    # Reassessment
    reassessment_required = Column(Boolean, default=False)
    reassessment_interval = Column(Integer)  # Minutes
    
    # Notes
    assessment_notes = Column(Text)
    red_flags = Column(Text)  # Critical warning signs
    
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    visit = relationship("EmergencyVisit", back_populates="triage_assessments")

class VitalSigns(Base):
    __tablename__ = "vital_signs"
    
    id = Column(Integer, primary_key=True, index=True)
    visit_id = Column(Integer, ForeignKey("emergency_visits.id"), nullable=False)
    recorded_by_id = Column(Integer, nullable=False)
    
    # Measurement details
    measurement_time = Column(DateTime, default=func.now())
    
    # Vital signs
    systolic_bp = Column(Integer)
    diastolic_bp = Column(Integer)
    mean_arterial_pressure = Column(Integer)
    heart_rate = Column(Integer)
    respiratory_rate = Column(Integer)
    temperature_celsius = Column(Numeric(4, 1))
    oxygen_saturation = Column(Integer)
    
    # Additional measurements
    weight_kg = Column(Numeric(6, 2))
    height_cm = Column(Numeric(6, 2))
    bmi = Column(Numeric(5, 2))
    
    # Pain assessment
    pain_score = Column(Integer)
    pain_location = Column(String(200))
    
    # Consciousness level
    glasgow_coma_scale = Column(Integer)
    pupils_left = Column(String(20))  # Size and reactivity
    pupils_right = Column(String(20))
    
    # Device information
    measurement_device = Column(String(100))
    oxygen_delivery_method = Column(String(50))  # Room air, Nasal cannula, etc.
    oxygen_flow_rate = Column(Numeric(4, 1))  # L/min
    
    # Clinical context
    position_during_measurement = Column(String(50))
    activity_level = Column(String(50))
    notes = Column(Text)
    
    # Alerts
    critical_values = Column(Boolean, default=False)
    alert_triggered = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    visit = relationship("EmergencyVisit", back_populates="vital_signs")

class EmergencyAlert(Base):
    __tablename__ = "emergency_alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    visit_id = Column(Integer, ForeignKey("emergency_visits.id"), nullable=True)
    
    # Alert details
    alert_type = Column(Enum(AlertType), nullable=False)
    severity = Column(String(10))  # LOW, MEDIUM, HIGH, CRITICAL
    title = Column(String(200), nullable=False)
    description = Column(Text)
    
    # Location and context
    location = Column(String(100))
    room_number = Column(String(20))
    affected_area = Column(String(100))
    
    # Timing
    alert_time = Column(DateTime, default=func.now())
    response_required_by = Column(DateTime)
    resolved_time = Column(DateTime)
    
    # Response tracking
    is_active = Column(Boolean, default=True)
    acknowledged_by = Column(JSON)  # List of user IDs who acknowledged
    responded_by = Column(JSON)  # List of responders
    
    # Escalation
    escalation_level = Column(Integer, default=1)
    auto_escalate = Column(Boolean, default=True)
    escalated_at = Column(DateTime)
    
    # Resolution
    resolution_notes = Column(Text)
    resolved_by_id = Column(Integer)
    
    # Metadata
    triggered_by_id = Column(Integer)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    visit = relationship("EmergencyVisit", back_populates="emergency_alerts")

class EmergencyBed(Base):
    __tablename__ = "emergency_beds"
    
    id = Column(Integer, primary_key=True, index=True)
    bed_number = Column(String(20), unique=True, nullable=False)
    
    # Bed details
    bed_type = Column(String(50))  # Trauma, Cardiac, Isolation, etc.
    location = Column(String(100))
    room_number = Column(String(20))
    zone = Column(String(50))  # Triage, Acute, Fast Track, etc.
    
    # Capabilities
    has_monitoring = Column(Boolean, default=False)
    has_ventilator = Column(Boolean, default=False)
    has_isolation = Column(Boolean, default=False)
    max_weight_kg = Column(Integer)
    
    # Status
    is_available = Column(Boolean, default=True)
    is_operational = Column(Boolean, default=True)
    cleaning_status = Column(String(20))  # Clean, Dirty, In_Progress
    
    # Current assignment
    assigned_patient_id = Column(Integer)
    assigned_at = Column(DateTime)
    estimated_discharge = Column(DateTime)
    
    # Maintenance
    last_maintenance = Column(DateTime)
    next_maintenance_due = Column(DateTime)
    maintenance_notes = Column(Text)
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class EmergencyStaff(Base):
    __tablename__ = "emergency_staff"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, unique=True)
    
    # Staff details
    role = Column(String(50))  # Physician, Nurse, Tech, etc.
    specialization = Column(String(100))
    certification_level = Column(String(50))
    
    # Scheduling
    is_on_duty = Column(Boolean, default=False)
    shift_start = Column(DateTime)
    shift_end = Column(DateTime)
    break_start = Column(DateTime)
    break_end = Column(DateTime)
    
    # Assignments
    assigned_zone = Column(String(50))
    assigned_beds = Column(JSON)  # List of bed IDs
    max_patients = Column(Integer, default=4)
    current_patient_count = Column(Integer, default=0)
    
    # Capabilities
    can_triage = Column(Boolean, default=False)
    can_intubate = Column(Boolean, default=False)
    can_suture = Column(Boolean, default=False)
    procedures_certified = Column(JSON)
    
    # Availability
    is_available = Column(Boolean, default=True)
    last_break = Column(DateTime)
    overtime_hours = Column(Numeric(4, 1), default=0)
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class EmergencyProtocol(Base):
    __tablename__ = "emergency_protocols"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    
    # Protocol details
    category = Column(String(50))  # Cardiac, Trauma, Stroke, etc.
    protocol_code = Column(String(20), unique=True)
    version = Column(String(10), default="1.0")
    
    # Activation criteria
    activation_criteria = Column(JSON)
    target_response_time = Column(Integer)  # Seconds
    
    # Steps and procedures
    steps = Column(JSON)  # Ordered list of protocol steps
    required_equipment = Column(JSON)
    required_medications = Column(JSON)
    required_staff_roles = Column(JSON)
    
    # Decision trees
    decision_points = Column(JSON)
    contraindications = Column(JSON)
    
    # Documentation
    description = Column(Text)
    indications = Column(Text)
    procedure_notes = Column(Text)
    post_procedure_care = Column(Text)
    
    # Quality metrics
    success_criteria = Column(JSON)
    key_performance_indicators = Column(JSON)
    
    # Compliance
    regulatory_requirements = Column(JSON)
    training_requirements = Column(JSON)
    
    # Status
    is_active = Column(Boolean, default=True)
    requires_physician_order = Column(Boolean, default=False)
    
    # Versioning
    created_by_id = Column(Integer)
    approved_by_id = Column(Integer)
    effective_date = Column(DateTime)
    expiry_date = Column(DateTime)
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class ProtocolActivation(Base):
    __tablename__ = "protocol_activations"
    
    id = Column(Integer, primary_key=True, index=True)
    protocol_id = Column(Integer, ForeignKey("emergency_protocols.id"), nullable=False)
    visit_id = Column(Integer, ForeignKey("emergency_visits.id"), nullable=True)
    
    # Activation details
    activated_by_id = Column(Integer, nullable=False)
    activation_time = Column(DateTime, default=func.now())
    activation_reason = Column(Text)
    
    # Response tracking
    response_team = Column(JSON)  # List of responding staff
    response_start_time = Column(DateTime)
    response_end_time = Column(DateTime)
    
    # Outcome tracking
    protocol_completed = Column(Boolean, default=False)
    completion_time = Column(DateTime)
    success_achieved = Column(Boolean)
    
    # Documentation
    steps_completed = Column(JSON)
    deviations_from_protocol = Column(Text)
    complications = Column(Text)
    outcome_notes = Column(Text)
    
    # Quality metrics
    response_time_seconds = Column(Integer)
    door_to_intervention_time = Column(Integer)
    patient_outcome = Column(String(50))
    
    # Deactivation
    deactivated_at = Column(DateTime)
    deactivated_by_id = Column(Integer)
    deactivation_reason = Column(Text)
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
