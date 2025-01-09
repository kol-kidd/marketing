import React from 'react'

function EmptyData({passStyle}) {
  return (
    <div className={`border rounded-lg flex justify-center p-5 items-center ${passStyle != '' && passStyle}`}>
      <div className="font-bold text-3xl">No data found</div>

    </div>
  )
}

export default EmptyData