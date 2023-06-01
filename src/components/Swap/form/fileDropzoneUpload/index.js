import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import cx from 'classnames';

import IconFile from './img/ic_file.svg';
import styles from './styles.module.scss';

const FileDropzoneUpload = (props) => {
  const { className, accept, onChange, url, loading } = props;
  const [file, setFile] = useState(null);

  const handleOnDrop = (files) => {
    setFile(files[0]);
    if (onChange) onChange(files[0]);
  };

  const handleRemove = () => {
    setFile('');
    if (onChange) onChange('');
  };

  return (
    <div className={cx(styles.wrapper, className)}>
      {file
        ? <>
          <div className={styles.file}>
            {!loading && <img alt="img-upload" src={url} />}
            <div>
              <span>{file?.name}</span>
              <button type="button" onClick={handleRemove}>Remove</button>
            </div>
          </div>
        </>
        : (
          <Dropzone multiple={false} onDrop={handleOnDrop} accept={accept}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className={cx(styles.dropzone, 'dropzone')}>
                  <img className={cx(styles.iconFile, 'img-upload')} alt="" src={url || IconFile} />
                  <div>Drag files here<br /> or click to upload</div>
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
