import React, { useState} from 'react';
import axios from 'axios';
import Loader from '../../components/loader/loader';
import "./signup.css";



const postData = async (email, mobile, firstName, lastName, password) => {
    try {
        const response = await axios.post(`https://fintech-zukf.onrender.com/user/create-user`,{
            email: email,
            mobile: mobile,
            firstName: firstName,
            lastName: lastName,
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

const SignUp = () => {
    const [isLoader, setLoader] = useState(false);
    const [email, setEmail] = useState('');
const [mobile, setMobile] = useState('');
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [password, setPassword] = useState('');
const [password2, setPassword2] = useState('');
    return (
        <>
            <div className="form-page-wrapper" >
                <form action="" onSubmit={async (event) => {
                event.preventDefault();
                setLoader(true);
                if (password !== password2) {
                    alert("Password not match");
                }else {
                    const resp = await postData(email, mobile, firstName, lastName, password);
                    if (resp.data.status === "success") {
                        setLoader(false);
                        console.log("redirect");
                       window.location = "/signin";
                    }
                    else {
                        setLoader(false);
                        alert(resp.data.message);
                    }
                    
                }
                

               
            }}>
                <h2>Join Fintech User</h2>
                    <label htmlFor="name">Full Name</label>
                    <input type="text" name="name" id="name" onBlur={(event) => {
                        let fullName = event.target.value ? event.target.value.split(" ") : null;
                        if (fullName != null) {
                            setFirstName(fullName[0]);
                            setLastName(fullName[1]);
                        }
                    } } placeholder="Ex. James Clerk" />

                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" id="email" onBlur={(event) => setEmail(event.target.value)} placeholder="Ex. example@gmail.com"/>

                    <label htmlFor="mobile">Phone Number</label>
                    <input type="tel" name="mobile" id="mobile" onBlur={(event) => setMobile(event.target.value)} placeholder="Ex. 07051324685" />

                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" onBlur={(event) => setPassword(event.target.value)} />

                    <label htmlFor="password2">Confirm Password</label>
                    <input type="password2" name="password2" id="password2" onBlur={(event) => setPassword2(event.target.value)}/>
                    <input type="submit" value="Submit" />
                </form>

                <div className="already-user">
                    <span>Already a user? <a href="../signin">Sign in</a></span>
                </div>
            </div>
            {
      isLoader === true ? <Loader /> : ""
     }
        </>
    )
}

export default SignUp;