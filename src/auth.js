export const isLoggedIn = ()=>{

    return !! localStorage.getItem('token');
}

export const token = ()=>{

    return localStorage.getItem('token');
}

export const logout = ()=>{
    
    return localStorage.removeItem('token');
}

export const login  =(user,token,cb)=>{

    localStorage.setItem('user',JSON.stringify(user));
    localStorage.setItem('token',token);

    cb()
}

export const user = ()=>{

    return JSON.parse(localStorage.getItem('user'))
}
