import Button from "../../components/Button"
import equip from "/images/equip.png"
import disband from "/images/disband.png"
import suit1 from "/images/suit_1.png"
import weapon1 from "/images/weapon_1.png"
import whiteUp from "/images/white_up.png"
import whiteDown from "/images/white_down.png"
import redLeft from "/images/red_left.png"
import redRight from "/images/red_right.png"
import training_calibre from "/images/training_calibre.png"
import training_fast from "/images/training_fast.gif"
import training_medium from "/images/training_medium.gif"
import training_slow from "/images/training_slow.gif"

const calibre = {
    paused: training_calibre,
    fast: training_fast,
    medium: training_medium,
    slow: training_slow,
}

export default function Training() {
    return (
        <div>
            <div style={{ display: "flex" }}>
                <div style={{ display: "flex" }}>
                    <div style={{ display: "flex" }}>
                        <div>Platoon</div>
                        <div>1st</div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            maxHeight: 42,
                        }}
                    >
                        <Button>
                            <img src={whiteUp} />
                        </Button>
                        <Button>
                            <img src={whiteDown} />
                        </Button>
                    </div>
                </div>
                <div style={{ display: "flex" }}>
                    <div style={{ display: "flex" }}>
                        <div>Troops</div>
                        <div>0</div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            maxHeight: 42,
                        }}
                    >
                        <Button>
                            <img src={whiteUp} />
                        </Button>
                        <Button>
                            <img src={whiteDown} />
                        </Button>
                    </div>
                </div>
                <div>
                    <div style={{ display: "flex" }}>
                        <div>Civilians</div>
                        <div>0</div>
                    </div>
                </div>
            </div>
            <div style={{ display: "flex" }}>
                <div>
                    <div>Suit Cost: 0 Cr.</div>
                    <div>
                        <img src={suit1} />
                    </div>
                    <div>
                        <Button>
                            <img src={redLeft} />
                        </Button>
                        <Button>
                            <img src={redRight} />
                        </Button>
                    </div>
                </div>
                <div>
                    <div>Suit Cost: 0 Cr.</div>
                    <div>
                        <img src={weapon1} />
                    </div>
                    <div>
                        <Button>
                            <img src={redLeft} />
                        </Button>
                        <Button>
                            <img src={redRight} />
                        </Button>
                    </div>
                </div>
                <div>
                    <div style={{ display: "flex" }}>
                        Location
                        <div>?</div>
                    </div>
                    <div style={{ display: "flex" }}>
                        Credits
                        <div>?</div>
                    </div>
                    <div style={{ display: "flex" }}>
                        Rank
                        <div>?</div>
                    </div>
                    <div>
                        To equip platoon with your selected suit and weapon,
                        will cost {0} credits.
                    </div>
                    <div>{/* message */}</div>
                    <div>
                        <Button>
                            <img src={equip} />
                        </Button>
                        <Button>
                            <img src={disband} />
                        </Button>
                    </div>
                    <div>
                        <img src={calibre.paused} />
                        Calibre 0%
                    </div>
                </div>
            </div>
        </div>
    )
}
