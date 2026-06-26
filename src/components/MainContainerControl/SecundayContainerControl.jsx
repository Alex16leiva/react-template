import { Box } from '@mui/material'
import React from 'react'

export const SecundayContainerControl = ({children, sx}) => {
  return (
    <Box sx={{
        overflow: 'hidden',
        m:1,
        borderRadius:1,
        ...sx
    }}>
        {children}
    </Box>
  )
}
