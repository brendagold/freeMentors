import jwt from "jsonwebtoken";

function jwtTokens({userid, firstName, lastName, email, password, address, bio, occupation, expertise}) {
    const user = {userid, firstName, lastName, email, password, address, bio, occupation, expertise};
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "7d"})
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "7d"})

    return ({accessToken, refreshToken})
}

export {jwtTokens}

