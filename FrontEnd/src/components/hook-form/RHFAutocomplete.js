import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { Autocomplete, TextField, Chip, Avatar, Box } from '@mui/material';

RHFAutocomplete.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  helperText: PropTypes.node,
  options: PropTypes.array.isRequired,
  multiple: PropTypes.bool,
  loading: PropTypes.bool,
};

export default function RHFAutocomplete({
  name,
  label,
  helperText,
  options = [],
  multiple = false,
  loading = false,
}) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          multiple={multiple}
          fullWidth
          options={options}
          getOptionLabel={(option) => option?.username || ''}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          value={field.value || (multiple ? [] : null)}
          onChange={(event, newValue) => {
            setValue(name, newValue, { shouldValidate: true });
          }}
          loading={loading}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={option.id}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      alt={option.username}
                      src={option.img || ''}
                      sx={{
                        width: 24,
                        height: 24,
                        marginRight: 1,
                      }}
                    />
                    {option.username}
                  </Box>
                }
                {...getTagProps({ index })}
              />
            ))
          }
          renderOption={(props, option) => (
            <li {...props}>
              <Box sx={{ display: 'flex', alignItems: 'center', padding: '12px 16px' }}>
                <Avatar
                  alt={option.username}
                  src={option.img || ''}
                  sx={{
                    width: 24,
                    height: 24,
                    marginRight: 1,
                  }}
                />
                <span>{option.username}</span>
              </Box>
            </li>
          )}
          ListboxComponent={(listboxProps) => (
            <Box
              {...listboxProps}
              sx={{
                maxHeight: '200px', // Limit the height of the dropdown
                overflowY: 'auto', // Enable scroll when content overflows
              }}
            />
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              error={!!error}
              helperText={error ? error.message : helperText}
            />
          )}
        />
      )}
    />
  );
}
