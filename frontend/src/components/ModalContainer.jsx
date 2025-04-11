import React from 'react'

const ModalContainer = ({ open, setOpen, children }) => {
    return (
        <>
            <div className={`fixed inset-0 z-[100] flex justify-center items-center transition-colors  
                ${open ? 'visible bg-black/20' : 'invisible'}`} onClick={() => setOpen}
            >
                {/* Modal Interface */}
                <div onClick={(e) => e.stopPropagation()}
                    className={`bg-white rounded-xl shadow p-6 transition-all 
                    ${open ? 'scale-100 opacity-100 duration-300' : 'scale-125 opacity-0 duration-50'}`}>
                    {children}
                </div>
            </div>
        </>
    )
}

export default ModalContainer