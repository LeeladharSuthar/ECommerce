import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { auth } from '../firebase';
import { useLoginMutation } from '../redux/api/userAPI';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { ApiErrorType, ApiResponseType } from '../types/api-types';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [mail, setMail] = useState<string>("");
    const [dob, setDob] = useState<string>("");

    const [login] = useLoginMutation()
    const navigate = useNavigate()
    const loginHandler = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const { user } = await signInWithPopup(auth, provider)
            const response = await login({
                name: user.displayName!,
                email: user.email!,
                photo: user.photoURL!,
                dob: dob ? dob : null,
                role: "user",
                gender: null,
                _id: user.uid
            })
            let { data, error } = response
            if (data) {
                toast.success(data.message)
                navigate("/")
            } else {
                toast.error((error as ApiErrorType).data.message)
            }
            // console.log(user)
            // {
            //     "uid": "P1vvwJxqKcZLchhVNkunUvd2vCm2",
            //     "email": "leeladharsuthar62@gmail.com",
            //     "emailVerified": true,
            //     "displayName": "Leeladhar Suthar",
            //     "isAnonymous": false,
            //     "photoURL": "https://lh3.googleusercontent.com/a/ACg8ocKNLYYfUjE_7fvBWqP-Hb0ZKRtzwmsPbu9opPjocHTCGQJTX3g=s96-c",
            //     "providerData": [
            //         {
            //             "providerId": "google.com",
            //             "uid": "104924089509862467510",
            //             "displayName": "Leeladhar Suthar",
            //             "email": "leeladharsuthar62@gmail.com",
            //             "phoneNumber": null,
            //             "photoURL": "https://lh3.googleusercontent.com/a/ACg8ocKNLYYfUjE_7fvBWqP-Hb0ZKRtzwmsPbu9opPjocHTCGQJTX3g=s96-c"
            //         }
            //     ],
            //     "stsTokenManager": {
            //         "refreshToken": "AMf-vBwdmtaz8D66MiByKdKSbedwB9WxOwBemh4n2iB9iv1nsHC2OFBZh-z64vY0HqUn3y-RJTRcLPyTNwl4Z_f3oRZGTl-o5GpdfC9sMg6JANfuhdCE4pSYSfV-z__Ciczut2Pw4xp21EXZBm1UGN8dnVGlCPgigBU912v_L4CzlQkn0plFAOwFjqEpQktaPSFV5A2Dx3HxPmfqIGxS0r1XVPFc9AeD7TkWDJvrA_zlgUWON5bRqfYt0aZ3VhuBGstuUbQnewGnPAg8H1xbR8oAN3ORuu3kz2DPv5H77l7aJS0KSKUvUpPSoesuMwM5d6psfQkJNF96IuqiSgvxUbTbwCvi32lHjXtjVN5A4UgVkvHGykF2F8hbWHWkNG53wvChxWtzL2-VTYpLmOKVxtx0K5cU4qJDNhhVv4nHK_Hr80v0jio9aB0vD1rNKJQxR8b0B5sWJqri",
            //         "accessToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjAyMTAwNzE2ZmRkOTA0ZTViNGQ0OTExNmZmNWRiZGZjOTg5OTk0MDEiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiTGVlbGFkaGFyIFN1dGhhciIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLTkxZWWZVakVfN2Z2QldxUC1IYjBaS1J0endtc1BidTlvcFBqb2NIVENHUUpUWDNnPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2Vjb21tZXJjZS0yZDk1YSIsImF1ZCI6ImVjb21tZXJjZS0yZDk1YSIsImF1dGhfdGltZSI6MTcyNTk5NDI2NiwidXNlcl9pZCI6IlAxdnZ3SnhxS2NaTGNoaFZOa3VuVXZkMnZDbTIiLCJzdWIiOiJQMXZ2d0p4cUtjWkxjaGhWTmt1blV2ZDJ2Q20yIiwiaWF0IjoxNzI1OTk0MjY2LCJleHAiOjE3MjU5OTc4NjYsImVtYWlsIjoibGVlbGFkaGFyc3V0aGFyNjJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDQ5MjQwODk1MDk4NjI0Njc1MTAiXSwiZW1haWwiOlsibGVlbGFkaGFyc3V0aGFyNjJAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.TD9GphEbZuuOQKHJ6MWIy81oMElnMYpH0fniP5Xq1z90RtuKSFy44ZB5UTP9JeowIEGKQaYhFZQBPScMtQdCdrAPHDNav2LF4EctcccxbHsRQhAB5tpov9SZwJUtUpS_MZM3GRPnbou4GJ1vwgt7kugkTjWCw1nSWkwCpRjH0qiICE2hOeHrgq64aYUNxuK6cxNgWJ0cpTB_IAGnG9kboS_OBn1qudzJu6tHTOKcR8RO97bNk8q1VRQfk0DeF4ZAcBRiSl2DtoWfp1hRUBqRyCv0OMbzrCl0q7S2m41oOmcdw_oh6EULvrLuspfn_KmnE1MbZmznfoV4-BYEKfs5pw",
            //         "expirationTime": 1725997865433
            //     },
            //     "createdAt": "1725994266548",
            //     "lastLoginAt": "1725994266548",
            //     "apiKey": "AIzaSyABSDx18g7pm4ZrqpyCv-n3sfb4B76EAOI",
            //     "appName": "[DEFAULT]"
            // }

        } catch (error) {
            toast.error("Sign in failed")
        }
    }

    return (
        <div className='login'>
            <main>
                <h1 className="heading">Login</h1>
                <div>
                    <div>
                        <label>Mail</label>
                        <input type="email" onChange={(e) => setMail(e.target.value)} value={mail} />
                    </div>
                    <div>

                        <label>DOB</label>
                        <input type="date" onChange={(e) => setDob(e.target.value)} value={dob} />

                    </div>
                </div>
                <div>
                    <p>Already Signed-In Once</p>
                    <button onClick={loginHandler}><FcGoogle /><span>Sign-In with Google</span></button>
                </div>
            </main>
        </div>
    )
}

export default Login