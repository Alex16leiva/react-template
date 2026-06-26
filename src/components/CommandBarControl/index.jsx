import { Box, Button, IconButton, Divider, Tooltip } from '@mui/material';

const CommandBarItem = ({ item }) => {
  if (item.type === 'divider') {
    return (
      <Divider
        orientation="vertical"
        flexItem
        sx={{ mx: 0.5, my: 0.75 }}
      />
    );
  }

  const button =
    item.variant === 'text' ? (
      <Button
        size="small"
        startIcon={item.icon}
        onClick={item.onClick}
        disabled={item.disabled}
        sx={{ textTransform: 'none', fontWeight: 500 }}
      >
        {item.label}
      </Button>
    ) : (
      <IconButton
        size="small"
        onClick={item.onClick}
        disabled={item.disabled}
        aria-label={item.label}
      >
        {item.icon}
      </IconButton>
    );

  if (!item.label) return button;

  return (
    <Tooltip title={item.label} placement="bottom">
      {/* span wrapper needed so Tooltip works when button is disabled */}
      <span style={{ display: 'inline-flex' }}>{button}</span>
    </Tooltip>
  );
};

export const CommandBarControl = ({ items = [] }) => {
  const leftItems  = items.filter((i) => i.align !== 'right');
  const rightItems = items.filter((i) => i.align === 'right');

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        
        
        minHeight: 40,
        bgcolor: '#fafafa',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Left group */}
      <Box sx={{ display: 'flex', alignItems: 'center'}}>
        {leftItems.map((item) => (
          <CommandBarItem key={item.id} item={item} />
        ))}
      </Box>

      {/* Right group */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {rightItems.map((item) => (
          <CommandBarItem key={item.id} item={item} />
        ))}
      </Box>
    </Box>
  );
};
