import React, { useState} from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import Loader from '../../components/loader/loader';
import "./signin.css";

const postData = async (email, password) => {
  try {
      const response = await axios.post(`https://fintech-zukf.onrender.com/user/login`,{
          email: email,
          password: password
        }, {
          headers: {
            Authorization: 'Bearer nt',
          },
        });

        return response
  } catch (error) {
      console.log(error);
  }
}

const SignIn = () => {
  const [isLoader, setLoader] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
      <>
          <div className='form-page-wrapper'>
            
              <form action="" onSubmit={ async (event) => {
                event.preventDefault();
                setLoader(true);
                
                const resp = await postData(email, password);
                    if (resp.data.status === "success") {
                      setLoader(false);
                      console.log(resp.data.data);
                      let userData = JSON.stringify(resp.data.data);
                      sessionStorage.setItem("userData", userData);
                      sessionStorage.setItem("loginStatus", true);
                      console.log("redirect");
                      window.location = "/home";
                    }
                    else {
                      setLoader(false);
                        alert(resp.data.message);
                    }
            }}>
              <h2>Welcome Back</h2>
                  <label htmlFor="email">Email</label>
                  <input type="text" name="email" id="email"  onChange={(event) => setEmail(event.target.value)} placeholder="Ex. example@gmail.com"/>

                  <label htmlFor="password">Password</label>
                  <input type="password" name="password" id="password"  onChange={(event) => setPassword(event.target.value)} />

                  <input type="submit" value="Submit" />
              </form>

              <div className="already-user">
                    <span>Not yet registered? <a href="../signup">Sign up</a></span>
                </div>
          </div>
          {
      isLoader === true ? <Loader /> : ""
     }
      </>
  )
}


  SignIn.propTypes = {
    text: propTypes.string,
    classes: propTypes.object,
    loginUser: propTypes.func,
  }
  export default SignIn;