import { Box } from '@mui/material'
import React from 'react'

export const SecundayContainerControl = ({children, sx}) => {
  return (
    <Box sx={{
        overflow: 'hidden',
        height:'100%',
        ...sx
    }}>
        {children}
    </Box>
  )
}
