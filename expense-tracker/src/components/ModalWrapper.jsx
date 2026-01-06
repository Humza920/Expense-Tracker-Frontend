// import { Outlet } from 'react-router-dom'
// import { useDispatch } from 'react-redux'
// import { closeModal } from "../features/modalslice"

// const ModalWrapper = () => {
//   const dispatch = useDispatch()

//   const handleOverlayClick = (e) => {
//     if (e.target === e.currentTarget) {
//       dispatch(closeModal())
//     }
//   }

//   return (
//     <div 
//       className="flex items-center justify-center"
//       onClick={handleOverlayClick}
//     >
//       <div 
//       // className=
//       // "bg-[#111827] rounded-2xl w-full max-w-md shadow-2xl relative border border-slate-700"
//       >
//         <button
//           // onClick={() => dispatch(closeModal())}
//           // className="absolute -top-3 -right-3 w-8 h-8 bg-slate-800 border border-slate-700 rounded-full 
//           //          text-gray-300 hover:text-white hover:bg-slate-700 flex items-center justify-center
//           //          transition-colors duration-200 z-10"
//         >
//           ✕
//         </button>
//         {/* <Outlet /> */}
//       </div>
//     </div>
//   )
// }

// export default ModalWrapper