import { forwardRef, useRef, useState } from 'react'
import useBounce from '../../hooks/useBounce'
import './DropZone.css'
import ErrorIcon from '../erroricon/ErrorIcon'
import { preventDefault, getClosest, setErrorAttribute, removeErrorAttribute, BASE_URL } from '../../utils/utils'

const DropZone = forwardRef(function DropZone(props, ref) {
  const { setUserAvatar, userAvatar, setImageUploaded, imageUploaded } = props
  const fileInputRef = useRef(null)
  const uploadBtnRef = useRef(null)

  const [addBounce, revBounce] = useBounce(uploadBtnRef)
  const [imageIsBig, setImageIsBig] = useState(false)

  const closestField = getClosest.call(null, ref.current, '.form__field')

  const dropZoneError = imageIsBig || closestField?.getAttribute('data-error') === ''

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
      !allowedFileTypes.find(type => type === selectedImage.type)) {
      handleRemoveImage()
      return setErrorAttribute(closestField)
    }

    if (Math.floor(selectedImage.size / 1024) >= allowedFileSize) {
      setErrorAttribute(closestField)
      handleRemoveImage()
      setImageIsBig(true)

      // removes the preview if the image is bigger than the allowedFileSize
      setImageUploaded(false)
      return
    }


    const reader = new FileReader(selectedImage)
    reader.readAsDataURL(selectedImage)

    reader.addEventListener('loadend', () => {
      if (reader.error) return setErrorAttribute(closestField)

      setImageUploaded(true)
      setImageIsBig(false)
      removeErrorAttribute(closestField)
      setUserAvatar(reader.result)
      ref.current.removeAttribute('data-error')
    }, { once: true })
  }

  function handleRemoveImage() {
    setImageUploaded(false)
    setUserAvatar('')
  }

  function handleUploadBtnAnimationEnd() {
    simulateInputFileClick()
    revBounce()
  }

  return (
    <>
      <div
        className='drop-zone'
        tabIndex='0'
        ref={ref}
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
            ref={uploadBtnRef}
            aria-label='Press to upload your avatar image'
            onClick={addBounce}
            onContextMenu={preventDefault}
            onAnimationEnd={handleUploadBtnAnimationEnd}>
            <img
              className='drop-zone__upload__icon'
              src={`${BASE_URL}assets/images/icon-upload.svg`}
              alt=''
              aria-hidden='true'
              width='30'
              height='30' />
          </button>

          <div className='drop-zone__text'>Drag and drop or click to upload</div>
        </div>

      </div>

      <div className={`drop-zone__max-size${dropZoneError ? ' max-size-error' : ''}`}>
        <ErrorIcon error={dropZoneError} />
        {imageIsBig ? 'File too largue. Please upload a photo under 500KB' : 'Upload your photo (JPG or PNG, max size: 500KB).'}
      </div>
    </>
  )
})

export default DropZone
