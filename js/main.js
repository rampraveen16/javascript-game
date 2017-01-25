// game is objectname
// init methodname
var moveShip;

var game = {
    wrapper: document.getElementById('wrapper'),
    container: document.getElementById('container'),
    gun: document.getElementById('gun'),
    score_board: document.getElementById('score'),
    target_board: document.getElementById('target'),
    level_board: document.getElementById('level'),
    ball_remain: document.getElementById('ballLeft'),
    config: function(level, speed, target, balls_left, score, shipSpeed) {
        game.level = level;
        game.speed = speed;
        game.target = target;
        game.balls_left = balls_left;
        game.initial_ball = 0;
        game.score = score;
        game.target_board.innerText = game.target;
        game.ball_remain.innerText = game.balls_left;
        game.end = 3;
        game.shipSpeed = shipSpeed;
        //return game;
    },

    init: function(level) {
        game.wrapper_width = wrapper.offsetWidth;
        game.wrapper_height = wrapper.offsetHeight;
        game.wrapper.onmousemove = function() {
            mouseX = event.clientX - container.offsetLeft;
            if (mouseX < 580)
                gun.style.left = mouseX + 'px';
        };
        game.wrapper.removeEventListener("click", game.clickHandler.bind(game));
        game.wrapper.addEventListener("click", game.clickHandler.bind(game));
        var addShip = setInterval(function() {
            var ship = document.createElement('span');
            game.appendShip(ship);

        }, Math.random() * game.shipSpeed);

    },
    clickHandler: function() {
        var bullet = document.createElement('i'),
            x = mouseX;
        bullet.beaten = false;
        game.ballLeft(bullet);
        game.fireBullet(bullet, x);


    },

    fireBullet: function(bullet, x) {
        var pos = game.wrapper_height - 50;
        var bullet_xPos = bullet.style.left;
        bullet.style.left = x + 'px';
        bullet.style.top = pos + 'px';
        game.wrapper.appendChild(bullet);

        var moveBullet = setInterval(function() {
            var topPos = bullet.offsetTop,
                beaten = game.ShipBeaten(bullet);
            if (bullet.beaten) {
                clearInterval(moveBullet);
                bullet.remove();
            } else if (topPos == 0) {
                clearInterval(moveBullet);
                bullet.remove();
            } else {
                pos -= 2;
                bullet.style.top = pos + 'px';
            }
        }, game.speed);

    },

    appendShip: function(ship) {
        var topPos = Math.random() * 250;
        var leftPos = game.wrapper_width + 100;
        ship.style.left = leftPos + 'px';
        ship.style.top = topPos + 'px';
        game.wrapper.appendChild(ship);
        var moveShip = setInterval(function() {
            var leftShipPos = ship.offsetLeft;
            if (leftShipPos == (-100)) {
                ship.remove();
            } else {
                leftShipPos -= 2;
                ship.style.left = leftShipPos + 'px';
            }
        }, Math.random() * 40);
    },

    ShipBeaten: function(bullet) {
        var ship = document.querySelectorAll('span');
        ship.forEach(function(element) {
            var sx = Math.floor(element.style.left.slice(0, -2)),
                sy = Math.floor(element.style.top.slice(0, -2)),
                bx = Math.floor(bullet.style.left.slice(0, -2)),
                by = Math.floor(bullet.style.top.slice(0, -2));

            if ((Math.abs(sx - bx) < 35) && (Math.abs(sy - by) < 10)) {
                element.remove();
                game.score += 50;
                game.score_board.innerText = game.score;
                var moveBullet = setInterval(function() {
                    if (game.score == game.target) {
                        clearInterval(moveBullet);
                        alert("level" + game.level + "completed");
                        ship.forEach(function(element) {
                          element.remove();
                        })
                        game.score_board.innerText = 0;
                        game.level++;
                        game.level_board.innerText = game.level;
                        game.nextLevel(game.level);
                    } else if (game.level == game.end) {
                        clearInterval(moveBullet);
                        game.wrapper.remove();
                        var article = document.createElement("article");
                        game.container.appendChild(article);
                        article.innerHTML = "YOU WON GAME"
                    }
                }, game.speed);
            }

        });
    },

    ballLeft: function(bullet) {
        game.initial_ball++;
        var remainBall = game.balls_left - game.initial_ball;

        (function(){
            if (remainBall >= 0) {
                game.ball_remain.innerText = remainBall;
            }
        })();

        if (game.initial_ball == game.balls_left) {
            var moveBullet = setInterval(function() {
                var topPos = bullet.offsetTop;
                if (topPos == 0) {
                    clearInterval(moveBullet);
                    game.wrapper.remove();
                    var article = document.createElement("article");
                    game.container.appendChild(article);
                    article.innerHTML = "YOU LOST GAME"

                }
            }, game.speed);

        }
    },

    nextLevel: function(level) {
        game.level = level;
        var levelTwo = new game.config(game.level, 1, 900, 30, 0, 4000);
    }
};

var game_obj = new game.config(1, 1, 600, 20, 0, 7000);
game.init();
