import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { loginRewardActions } from '_actions';

import FirstReward from 'components/LoginRewards/FirstReward';
import OtherRewards from 'components/LoginRewards/OtherRewards';
import EmptyReward from 'components/LoginRewards/EmptyReward';

const ipc = window.require('electron').ipcRenderer;

const LoginRewardsContainer = props => {

  const scaleTopText = id => {
    let textElement = document.getElementById(id);
    let containerElement = document.getElementsByClassName('reward-text-container')[0];

    if(textElement !== null && containerElement !== null){
      let textWidth = document.getElementById(id).clientWidth;
      let containerWidth = document.getElementsByClassName('reward-text-container')[0].clientWidth-1;
      let textSize = Number(document.getElementById(id).style.fontSize.replace('px', ''));

      while(textWidth >= containerWidth && textSize > 5){
        textSize--;
        document.getElementById(id).style.fontSize = `${textSize}px`;
        textWidth = document.getElementById(id).clientWidth;
        containerWidth = document.getElementsByClassName('reward-text-container')[0].clientWidth-1;
      }
    }
  }

  useEffect(() => {
    props.getLoginRewards();

    ipc.on('get-login-bonus-success', (e, res) => {
      props.setLoginRewards(res);
    });

    ipc.on('get-login-bonus-error', (e, error) => {
      props.loginRewardsError(error);
    })

    return () => {
      ipc.removeAllListeners('get-login-bonus-success');
      ipc.removeAllListeners('get-login-bonus-error');
    }
    // eslint-disable-next-line
  }, []);

  // MAKES SURE THE TEXT FIT INSIDE
  useEffect(() => {
    for(let i = 1; i <= props.count; i++){
      scaleTopText(`top-text-${i}`);
    }
  });

  return(
    <div className="rewards-container">
      {(props.rewards[0] !== null)?
        <FirstReward 
          imagePath={props.rewards[0].image_path} 
          topText={props.rewards[0].item_name}
          bottomText={props.rewards[0].bottom_text}>
        </FirstReward> : <EmptyReward></EmptyReward>
      }
      {
        props.rewards.slice(1, props.count).map((reward, index) => {
          return <OtherRewards 
            index={index + 2} 
            imagePath={reward.image_path} 
            topText={reward.item_name}
            bottomText={reward.bottom_text}>
          </OtherRewards>
        })
      }
      {
        props.rewards.slice(props.count, 5).map((reward, index) => {
          return <EmptyReward></EmptyReward>
        })
      }
    </div>
  );
}

const mapStateToProps = (state) => {
  return state.loginRewards;
}

export default connect(mapStateToProps, loginRewardActions)(LoginRewardsContainer);