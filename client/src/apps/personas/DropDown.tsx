import React from 'react';
import { MenuItem, FormControl, Select, Grid } from '@mui/material';
type OriginalDataType = {
  id: string;
  createdDate: string;
  updatedDate: string;
  title: string;
  icon: string;
  color: string;
};
export function DropDown(props: {   categoryIdUpdate: (val: string) => void  , categories: OriginalDataType[] }) {
  const [value, setValue] = React.useState('');

  const handleChange = (event: any) => {
    if (event) {
      console.log('Updated value', props.categories[event?.target.value].title);
      setValue(props.categories[event?.target.value].id);
      props.categoryIdUpdate(props.categories[event?.target.value].id as string);
    }
  };

  return (
    <FormControl>
      <Select  onChange={handleChange}>
        {props.categories.map((item, key) => (
          <Grid key={key}>
            <MenuItem value={key}>{item.title}</MenuItem>
          </Grid>
        ))}
      </Select>
    </FormControl>
  );
}
