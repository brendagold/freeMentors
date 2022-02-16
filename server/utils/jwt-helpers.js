import jwt from "jsonwebtoken";

function jwtTokens({userid,firstName,email}) {
    const user = {userid, firstName, email};
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "30s"})
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "5m"})

    return ({accessToken, refreshToken})
}

export {jwtTokens}

