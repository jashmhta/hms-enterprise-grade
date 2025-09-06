import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  Container, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid
} from '@mui/material';

const AccountingPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['journal_entries'],
    queryFn: async () => (await axios.get('/api/erp/journal_entries')).data
  });

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ date: '', description: '' });
  const [editId, setEditId] = useState<number | null>(null);

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editId) {
        return (await axios.put(`/api/erp/journal_entries/${editId}`, payload)).data;
      }
      return (await axios.post('/api/erp/journal_entries', payload)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['journal_entries']);
      handleClose();
    }
  });

  const handleOpen = (record?: any) => {
    if (record) {
      setFormData({ date: record.date, description: record.description });
      setEditId(record.id);
    } else {
      setFormData({ date: '', description: '' });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ date: '', description: '' });
    setEditId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    mutation.mutate(formData);
  };

  if (isLoading) return <Typography>Loading Accounting data...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Accounting System - Journal Entries</Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mb: 2 }}>Add Entry</Button>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((entry: any) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleOpen(entry)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? 'Edit Entry' : 'Add Entry'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Date" name="date" type="date" InputLabelProps={{ shrink: true }} value={formData.date} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>{editId ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AccountingPage;
