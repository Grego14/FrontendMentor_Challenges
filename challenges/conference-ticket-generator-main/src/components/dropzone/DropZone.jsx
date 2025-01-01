import React, { useState, useRef } from 'react'
import './DropZone.css'

const base_url = import.meta.env.BASE_URL

export default function DropZone({ sendUserAvatar }) {
  const fileInputRef = useRef(null)

  const [imageIsInvalid, setImageIsInvalid] = useState(false)
  const [imageUploaded, setImageUploaded] = useState(false)
  const [userAvatar, setUserAvatar] = useState(null)

  const svgColor = imageIsInvalid ? 'var(--color-orange-700)' : '#D1D0D5'

  // clicks on the hidden input
  function simulateInputFileClick() {
    fileInputRef.current.click()
  }

  function preventDefaultAndPropagation(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleDropZoneEnter(e) {
    if (e.key === 'Enter' && e.type === 'keydown') simulateInputFileClick()
  }

  function getImage(e) {
    preventDefaultAndPropagation(e)

    const selectedImage = e[e.dataTransfer ? 'dataTransfer' : 'target'].files[0]
    validateSelectedImage(selectedImage)
  }

  function validateSelectedImage(selectedImage) {
    const allowedFileTypes = ['image/jpeg', 'image/png']
    const allowedFileSize = 500

    if (!selectedImage ||
      !allowedFileTypes.find(type => type === selectedImage.type))
      return setImageIsInvalid(true)

    if (Math.floor(selectedImage.size / 1024) >= allowedFileSize) {
      setImageIsInvalid(true)

      // removes the preview if the image is bigger than the allowedFileSize
      setImageUploaded(false)
      return
    }

    setImageUploaded(true)

    const reader = new FileReader(selectedImage)

    reader.addEventListener('loadend', () => {
      setUserAvatar(reader.result)
      sendUserAvatar(reader.result)
    }, { once: true })

    reader.readAsDataURL(selectedImage)

    setImageIsInvalid(false)
  }

  function handleRemoveImage() {
    setImageUploaded(false)
  }

  return (
    <>
      <div className='drop-zone' tabIndex='0'
        aria-label='Drag and drop or click to upload your avatar image'
        onDragOver={preventDefaultAndPropagation}
        onDragEnter={preventDefaultAndPropagation}
        onDrop={getImage}
        onKeyDown={handleDropZoneEnter}>

        <input
          type='file'
          ref={fileInputRef}
          accept='image/jpeg,image/png'
          className='file-input'
          onChange={getImage}
        />

        <div className={`drop-zone__preview${imageUploaded
          ? ' drop-zone__preview--show'
          : ' drop-zone__preview--hidden'}`}>

          <div>
            <img className='preview__image'
              src={userAvatar}
              alt=''
              width='48'
              aria-hidden='true'
              height='48' />
          </div>

          <div>
            <button
              className='preview__button preview__button--remove'
              onClick={handleRemoveImage}>
              Remove image
            </button>
            <button
              className='preview__button preview__button--change'
              onClick={simulateInputFileClick}>
              Change image
            </button>
          </div>

        </div>

        <div className={`drop-zone__upload-container${imageUploaded
          ? ' upload-container--hidden'
          : ' upload-container--show'}`}>

          <button className='drop-zone__upload'
            aria-label='Press to upload your avatar image'
            onClick={simulateInputFileClick}>
            <img
              className='drop-zone__upload__icon'
              src={`${base_url}assets/images/icon-upload.svg`}
              alt=''
              aria-hidden='true'
              width='30'
              height='30' />
          </button>

          <div className='drop-zone__text'>Drag and drop or click to upload</div>
        </div>

      </div>

      <div className={`drop-zone__max-size${imageIsInvalid ? ' drop-zone__max-size-error' : ''}`}>

        <svg className='max-size-icon'
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden='true'
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 16 16">
          <path stroke={svgColor} strokeLinecap="round"
            strokeLinejoin="round" d="M2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8Z" />
          <path fill={svgColor} d="M8.004 10.462V7.596ZM8 5.57v-.042Z" />
          <path stroke={svgColor} strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.004 10.462V7.596M8 5.569v-.042" />
        </svg>
        Upload your photo (JPG or PNG, max size: 500KB).
      </div>
    </>
  )
}
