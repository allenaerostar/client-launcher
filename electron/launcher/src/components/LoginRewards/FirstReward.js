import React from 'react';
import placeholderImg from 'assets/image-placeholder.png';
import specialGacha from 'assets/special_gacha_ticket.png';
import reset from 'assets/reward_reset.png';

const FirstReward = ({imagePath, topText, bottomText}) => {
  let image;

  if(imagePath === 'assets/image-placeholder.png'){
    image = placeholderImg;
  }
  else if(imagePath === 'assets/special_gacha_ticket.png'){
    image = specialGacha;
  }
  else if(imagePath === 'assets/reward_reset.png'){
    image = reset;
  }
  else{
    image = `file://${imagePath}`;
  }

  return (
    <div className="first-reward">
      <img className="reward-image" src={image} alt="hi" height="50px" width="50px"></img>
      <div className="reward-text-container">
        <div className="reward-top-text">
          <span className="reward-top-span" id="top-text-1" style={{fontSize: '15px'}}>{topText}</span>
        </div>
        <div className="reward-bottom-text">
          <span className="reward-bottom-span">
            <i>{bottomText}</i>
          </span>
          </div>
      </div>
    </div>
  );
}

export default FirstReward;