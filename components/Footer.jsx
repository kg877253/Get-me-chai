import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-gray-800/80 text-white py-5 text-center w-full text-sm sm:text-base px-4">
      Copyright &copy; {currentYear} Get-me-chai. All rights reserved.
    </div>
  )
}

export default Footer