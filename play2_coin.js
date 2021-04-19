const Discord = require('discord.js')
const client = new Discord.Client()
const auth = require('./token.json');
const mysql = require('mysql2')

const coin = 0 //Default
let current_coin = 0

let db_con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'play2_coin'
})

client.on('ready', ()=>{
    console.log("Market is ready")
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

                    msg.channel.send("Current you hold : "+rs[0].coin+" Coin")
                })
            }
            else{
                msg.channel.send("Don't have this account!")
            }
        })
    }
})


client.on('message', (msg)=>{
    let getIdUser = msg.member.id
    let user_coin = 0
    let random_coin = Math.random()*0.5
    let random_coin_2pos = random_coin.toFixed(2)
    if(msg.content == '!dig'){
        let time = Math.floor(Math.random()*5000)+1000 //1 s -> 3 s
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

                        msg.channel.send("Get Coin +"+random_coin_2pos+" Coin")
                    })
                }
                else{
                    msg.channel.send("Dont have this id")
                }
            })
        },time)
    }
})

client.login(auth.token)