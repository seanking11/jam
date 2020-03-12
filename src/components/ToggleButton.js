import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ToggleButton = ({
    className,
    iconA,
    iconB,
    onToggle = () => {},
    size,
}) => {
    const [showIconA, setShowIconA] = useState(true)

    const icon = showIconA ? iconA : iconB
    return (
        <div className={className}>
            <FontAwesomeIcon
                className="cursor-pointer"
                icon={icon}
                onClick={() => {
                    onToggle()
                    setShowIconA(!showIconA)
                }}
                size={size}
            />
        </div>
    )
}

export default ToggleButton
