import React from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {closeModal} from "../features/modalslice"

const ModalWrapper = () => {
  const dispatch = useDispatch()

  return (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[#111827] p-6 rounded-2xl w-full max-w-md shadow-lg relative">
        <button
          onClick={dispatch(closeModal)}
          className="absolute top-4 right-4 text-gray-300 hover:text-white"
        >
          ✕
        </button>
        <Outlet />
      </div>
    </div>
  )
}

export default ModalWrapper