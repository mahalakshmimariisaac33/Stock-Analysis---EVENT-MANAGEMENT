import React from 'react';
import './PandaLoader.css';

const PandaLoader = ({ message = 'Analyzing...' }) => {
  return (
    <div className="panda-loader-overlay">
      <div className="panda-loader">
        <div className="panda-container">
          <div className="panda">
            <div className="panda-face">
              <div className="panda-ear left"></div>
              <div className="panda-ear right"></div>
              <div className="panda-head">
                <div className="panda-eye left">
                  <div className="panda-pupil"></div>
                </div>
                <div className="panda-eye right">
                  <div className="panda-pupil"></div>
                </div>
                <div className="panda-nose"></div>
                <div className="panda-mouth"></div>
              </div>
            </div>
            <div className="panda-body">
              <div className="panda-arm left"></div>
              <div className="panda-arm right"></div>
              <div className="panda-belly"></div>
            </div>
          </div>
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
};

export default PandaLoader;