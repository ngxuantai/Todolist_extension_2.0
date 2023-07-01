import React, {useState} from 'react';
import '../css/NotifiedForm.css';
import {addNotified} from '../servicces/notifiedService';

const isEmailValid = (email) => {
  // Sử dụng biểu thức chính quy (regular expression) để kiểm tra định dạng email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

class NotifiedForm extends React.Component {
  state = {
    email: '',
    selectedOption: '15 phút',
  };

  handleChangeEmail = ({currentTarget: input}) => {
    this.setState({email: input.value});
  };

  handleChange = async (event) => {
    // this.setState({selectedOption: event.target.value});
    if (isEmailValid(this.state.email)) {
      console.log(this.state.email);
      console.log(this.state.selectedOption);
      try {
        const notified = {
          email: this.state.email,
          time: this.state.selectedOption.match(/\d+/)[0],
        };
        const queryParams = {
          type: 'normal',
        };
        await addNotified(notified, queryParams);
      } catch (error) {}
      const {close} = this.props;
      close();
    }
  };

  handleClose = () => {
    const {close} = this.props;
    close();
  };

  handleOptionChange = (event) => {
    this.setState({selectedOption: event.target.value}, () => {
      console.log(this.state.selectedOption);
    });
  };

  render() {
    return (
      <div className='form-overlay'>
        <div className='notified-form'>
          <label>Nhập địa chỉ email</label>
          <input
            type='email'
            pattern='^[^\s@]+@[^\s@]+\.[^\s@]+$'
            value={this.state.email}
            required={true}
            onChange={this.handleChangeEmail}
            placeholder='Email'
          />
          <div className='radio-options'>
            <label>
              <input
                type='radio'
                value='15 phút'
                checked={this.state.selectedOption === '15 phút'}
                onChange={this.handleOptionChange}
              />
              15 phút
            </label>
            <label>
              <input
                type='radio'
                value='30 phút'
                checked={this.state.selectedOption === '30 phút'}
                onChange={this.handleOptionChange}
              />
              30 phút
            </label>
            <label>
              <input
                type='radio'
                value='45 phút'
                checked={this.state.selectedOption === '45 phút'}
                onChange={this.handleOptionChange}
              />
              45 phút
            </label>
          </div>
          <div className='button-container'>
            <button
              className='update-button'
              variant='outlined'
              onClick={() => this.handleChange()}
            >
              Cập nhật
            </button>
            <button className='close-button' onClick={() => this.handleClose()}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default NotifiedForm;
