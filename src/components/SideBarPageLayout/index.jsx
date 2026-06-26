import { Box } from '@mui/material';
import { SideBarControl } from '../SideBarControl';

export const SideBarPageLayout = ({ title, items, activeId, onItemClick, children }) => (
  <Box sx={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
    <SideBarControl
      title={title}
      items={items}
      activeId={activeId}
      onItemClick={onItemClick}
    />
    <Box sx={{ flex: 1, minWidth: 0, minHeight: 0, overflow: 'auto' }}>
      {children}
    </Box>
  </Box>
);
