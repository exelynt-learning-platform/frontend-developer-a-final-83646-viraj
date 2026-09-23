import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';

const EmployeeFormDialog = ({
  open,
  mode = 'add',
  employee = null,
  countries = [],
  onSubmit,
  onClose,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      country: '',
    },
  });

  useEffect(() => {
    if (employee && mode === 'edit') {
      reset({
        name: employee.name || '',
        email: employee.email || employee.emailId || '',
        mobile: employee.mobile || '',
        country: employee.country || '',
      });
    } else {
      reset({
        name: '',
        email: '',
        mobile: '',
        country: '',
      });
    }
  }, [employee, mode, open, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ color: '#000' }}>
        {mode === 'edit' ? 'Edit Employee' : 'Add Employee'}
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
        >
          <TextField
            label="Name"
            fullWidth
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
              maxLength: {
                value: 50,
                message: 'Name must be at most 50 characters',
              },
            })}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
          />

          <TextField
            label="Email"
            fullWidth
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address',
              },
            })}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
          />

          <TextField
            label="Mobile Number"
            fullWidth
            {...register('mobile', {
              required: 'Mobile number is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Mobile number must be exactly 10 digits',
              },
            })}
            error={Boolean(errors.mobile)}
            helperText={errors.mobile?.message}
          />

          <Controller
            name="country"
            control={control}
            rules={{
              required: 'Country is required',
            }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Country"
                fullWidth
                error={Boolean(errors.country)}
                helperText={errors.country?.message}
              >
                {countries.map((c) => (
                  <MenuItem key={c.id || c.country} value={c.country}>
                    {c.country}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EmployeeFormDialog;
