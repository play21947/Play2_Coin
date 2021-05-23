const Discord = require('discord.js')
const client = new Discord.Client()
const auth = require('./token.json');
const mysql = require('mysql2')

const coin = 0 //Default
// let current_coin = 0

// let plus=()=>{
//     msg.channel.send("2 + 5")
// }

let db_con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'play2_coin'
})


client.on('message', (msg)=>{
    let id = msg.member.id
    let bet = 0
    let AI = Math.floor(Math.random()*9)+1
    if(msg.content == '!pokdeng'){
        db_con.query("SELECT * FROM users WHERE username = ?", [id], (err,rs)=>{
            if(err) throw err

            if(rs.length > 0){
                msg.channel.send("How much do you bet ?")
                client.on('message', (msg)=>{
                    console.log(msg.content)
                    if(msg.content >= 5){
                        bet = msg.content
                        console.log(bet)
                        if(rs[0].coin > bet){
                            let user = 0
                            setTimeout(()=>{
                                let Random_user = Math.floor(Math.random()*9)+1
                                user = Random_user
                                msg.channel.send("First time you get : "+ user)
                            },2000)
                            setTimeout(() => {
                                msg.channel.send("Do you want to draw if you want press[1] and if you dont want press [2]")
                            }, 3000);
                            client.on('message', (msg)=>{
                                if(msg.content == '1' || msg.content == 1){
                                    let Random_user_two = Math.floor(Math.random()*9)+1
                                    for(let i=0;i<Random_user_two;i++){
                                        user = user + 1
                                        if(user == 10){
                                            user = 1
                                        }
                                    }
                                    msg.channel.send("Second time you get : "+ Random_user_two)
                                    if(user == AI){
                                        msg.channel.send("The result of User is : "+ user)
                                        msg.channel.send("The result of AI is :"+ AI)
                                        msg.channel.send("Draw")
                                    }
                                    else if(user > AI){
                                        db_con.query("SELECT * FROM users WHERE username = ?", [id], (err,rs)=>{
                                            if(err) throw err

                                            let all_coin = parseFloat(rs[0].coin)
                                            let result = all_coin + parseFloat(bet)
                                            db_con.query("UPDATE users SET coin = ? WHERE username = ?",[result, id], (err,rs)=>{
                                                if(err) throw err

                                                msg.channel.send("The result of User is : "+ user)
                                                msg.channel.send("The result of AI is :"+ AI)
                                                msg.channel.send("You Win")
                                                msg.channel.send("Get profit + "+bet)
                                            })
                                        })
                                    }
                                    else if(user < AI){
                                        db_con.query("SELECT * FROM users WHERE username = ?", [id], (err,rs)=>{
                                            if(err) throw err

                                            let all_coin = parseFloat(rs[0].coin)
                                            let result = all_coin - parseFloat(bet)
                                            db_con.query("UPDATE users SET coin = ? WHERE username = ?",[result, id], (err,rs)=>{
                                                if(err) throw err

                                                msg.channel.send("The result of User is : "+ user)
                                                msg.channel.send("The result of AI is :"+ AI)
                                                msg.channel.send("You Lose")
                                                msg.channel.send("Lose Money - "+bet)
                                            })
                                        })
                                    }
                                }
                                else if(msg.content == '2' || msg.content == 2){
                                    if(user == AI){
                                        msg.channel.send("The result of User is : "+ user)
                                        msg.channel.send("The result of AI is :"+ AI)
                                        msg.channel.send("Draw")
                                    }
                                    else if(user > AI){
                                        db_con.query("SELECT * FROM users WHERE username = ?", [id], (err,rs)=>{
                                            if(err) throw err

                                            let all_coin = parseFloat(rs[0].coin)
                                            let result = all_coin + parseFloat(bet)
                                            db_con.query("UPDATE users SET coin = ? WHERE username = ?",[result, id], (err,rs)=>{
                                                if(err) throw err

                                                msg.channel.send("The result of User is : "+ user)
                                                msg.channel.send("The result of AI is :"+ AI)
                                                msg.channel.send("You Win")
                                                msg.channel.send("Get profit + "+bet)
                                            })
                                        })
                                    }
                                    else if(user < AI){
                                        db_con.query("SELECT * FROM users WHERE username = ?", [id], (err,rs)=>{
                                            if(err) throw err

                                            let all_coin = parseFloat(rs[0].coin)
                                            let result = all_coin - parseFloat(bet)
                                            db_con.query("UPDATE users SET coin = ? WHERE username = ?",[result, id], (err,rs)=>{
                                                if(err) throw err

                                                msg.channel.send("The result of User is : "+ user)
                                                msg.channel.send("The result of AI is :"+ AI)
                                                msg.channel.send("You Lose")
                                                msg.channel.send("Lose Money - "+bet)
                                            })
                                        })
                                    }
                                }
                            })
                        }
                        else{
                            msg.channel.send("Your pocket dont have money enough")
                            msg.channel.send("Bet Again!")
                        } 
                    }
                })
            }
            else{
                msg.channel.send("You should register before!")
            }
        })
    }
})



//////////////////////////////////////////

client.on('ready', ()=>{
    console.log("Market is ready")
})

client.on("message", (msg)=>{
    if(msg.content == '!id'){
        msg.member.send(msg.member.id)
    }
})

client.on("message", (msg)=>{
    if(msg.content == '!id'){
        msg.member.send(msg.member.id)
    }
})

client.on("message", (msg)=>{
    if(msg.content == '!func'){
        msg.channel.send('1.!coin : เช็คเหรียญที่ถืออยู่ \n2.!dig : ขุดเหรียญ Play2_coin')
    }
})

client.on('message', (msg)=>{
    if(msg.content == 'เปิดตลาด'){
        msg.channel.send("เปิดตลาดการเทรด")
    }
    else{
        if(msg.content == 'ปิดตลาด'){
            db_con = ''
            msg.channel.send("ปิดตลาดการเทรด")
        }
    }
})

client.on('message', msg =>{
    let getIdUser = msg.member.id
    if(msg.content === '!play2_coin_register'){
        db_con.query("SELECT * FROM users WHERE username = ?",[getIdUser], (err,rs)=>{
            if(err) throw err

            if(rs.length > 0){
                msg.channel.send("We have this id already")
            }
            else{
                db_con.query("INSERT INTO users (username, coin) VALUES (?, ?)",[getIdUser, coin], (err,rs)=>{
                    if(err) throw err
        
                    msg.channel.send("Register Successfully")
                })
            }
        })
    }
})

client.on('message', (msg)=>{
    let getIdUser = msg.member.id
    if(msg.content == '!coin'){
        db_con.query("SELECT * FROM users WHERE username = ?", [getIdUser], (err,rs)=>{
            if(err) throw err

            if(rs.length > 0){
                db_con.query("SELECT coin FROM users WHERE username = ?", [getIdUser], (err,rs)=>{
                    if(err) throw err

                    msg.channel.send("Current you hold : "+rs[0].coin+" Play2")
                })
            }
            else{
                msg.channel.send("Don't have this account!")
            }
        })
    }
})


client.on('message', (msg)=>{
    let working = false
    let getIdUser = msg.member.id
    let user_coin = 0
    let random_coin = Math.random()*0.5
    let random_coin_2pos = random_coin.toFixed(2)
    if(msg.content == '!dig' && working == false){
        working = true
        let time = Math.floor(Math.random()*10000)+1000 //1 s -> 10 s
        let cvt_time = time / 1000
        msg.channel.send("Wait : "+ cvt_time + " s")
        setTimeout(()=>{
            db_con.query("SELECT * FROM users WHERE username = ?", [getIdUser], (err,rs)=>{
                if(err) throw err
                
                if(rs.length > 0){
                    user_coin = rs[0].coin
                    let cvt_user_coin = parseFloat(user_coin)
                    let cvt_random_coin = parseFloat(random_coin_2pos)
                    let result = cvt_user_coin + cvt_random_coin
                    db_con.query("UPDATE users SET coin = ? WHERE username = ?", [result, getIdUser], (err,rs)=>{
                        
                        if(err) throw err

                        msg.channel.send("Get Coin +"+random_coin_2pos+" Play2")
                        working = false
                    })
                }
                else{
                    msg.channel.send("Dont have this id")
                    working = false
                }
            })
        },time)
    }
})

client.login(auth.token)