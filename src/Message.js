import React from 'react'

const Message = ({msg, show, status}) => {
    return (
        <div className={`message-box ${show} ${status}`}>
            {msg}
        </div>
    )
}

export default Message