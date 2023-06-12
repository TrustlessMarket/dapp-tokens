import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import cx from 'classnames';

import IconFile from './img/ic_file.svg';
import styles from './styles.module.scss';
import { Skeleton } from '@chakra-ui/react';
import { toast } from 'react-hot-toast';

const FileDropzoneUpload = (props) => {
  const { className, accept, onChange, url, loading, icon, maxSize, text} = props;
  const [file, setFile] = useState(null);

  const handleOnDrop = (files) => {
    if (file?.[0]?.size > maxSize) {
      toast.error('Max image size: 1MB');
    } else {
      setFile(files[0]);
      if (onChange) onChange(files[0]);
    }
  };

  const handleRemove = () => {
    setFile('');
    if (onChange) onChange('');
  };

  return (
    <div className={cx(styles.wrapper, className)}>
      {file
        ? <>
          <div className={cx(styles.file, 'uploaded')}>
            <Skeleton isLoaded={!loading}>
              {!loading && (<img alt="img-upload" src={url} /> || icon)}
            </Skeleton>

            <div>
              <span>{file?.name}</span>
              <button type="button" onClick={handleRemove}>Remove</button>
            </div>
          </div>
        </>
        : (
          <Dropzone multiple={false} onDrop={handleOnDrop} accept={accept} >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className={cx(styles.dropzone, 'dropzone')}>
                  {
                    icon || <img className={cx(styles.iconFile, 'img-upload')} alt="" src={url || IconFile} />
                  }
                  {
                    text || <div>Drag files here<br /> or click to upload</div>
                  }
                </div>
              </div>
            )}
          </Dropzone>
        )
      }
    </div>
  );
};

export default FileDropzoneUpload;
