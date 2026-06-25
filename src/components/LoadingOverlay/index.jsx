import { Backdrop, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectIsLoading } from '../../store/loadingSlice';

export const LoadingOverlay = () => {
  const isLoading = useSelector(selectIsLoading);

  return (
    <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 10 }}>
      <CircularProgress color="inherit" size={56} />
    </Backdrop>
  );
};
