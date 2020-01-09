import React from 'react';
import Dropzone from 'react-dropzone';

import FileInputs from 'components/Uploader/FileInputs';

import upload_icon from 'assets/icons/upload_icon.svg';

// {
//   version: 'v1.1',
//     root: 'C:\Nexon',
//       files: [
//         'C:\Nexon\Map.wz',
//         'C:\Nexon\Character.wz'
//       ]
// }

// const { remote } = window.require('electron')

const Uploader = ({uploadFiles, changeFileInfo, files}) => {
  return (
    <>
      <div className="row mt-4">
        <div className="col-12">
          <Dropzone onDrop={acceptedFiles => uploadFiles(acceptedFiles)} >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <img src={upload_icon} alt="cloud with arrow" />
                <h2>Drag and drop or click here to upload files</h2>
              </div>
            )}
          </Dropzone>
        </div>
      </div>
      {
        files ?
          <div className="row">
            <div className="col-12">
              {
                files.map((fileData, index) => (
                  <FileInputs
                    handleChange={changeFileInfo}
                    fileData={fileData}
                    index={index}
                    key={index}
                  />
                ))
              }
            </div>
          </div>
          : null
      }
    </>
  );
}

export default Uploader;