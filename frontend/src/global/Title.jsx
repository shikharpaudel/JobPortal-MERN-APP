import React from 'react'

const Title = (props) => {
  return (
    <div className='bg-[#F4F5F7] p-4'>
<h2 className='text-black text-[1.2rem] font-poppins sm:text-[1.875rem] font-[500] '>{props.title}</h2>
</div>
  )
}

export default Title