import { Box } from '@mui/material'
import React from 'react'

export const SecundayContainerControl = ({children, sx}) => {
  return (
    <Box sx={{
        overflow: 'hidden',
        m:2,
        height:'calc(100% - 38px)',
        ...sx
    }}>
        {children}
    </Box>
  )
}
