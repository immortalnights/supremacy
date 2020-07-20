import React from 'react'
import {} from 'recoil'
import { Button } from 'seventh-component-library'

const Training = props => {
	const civilians = 0
	const credits = 0
	const rank = ''
	const message = ''
	const calibre = 0

	return (
		<div>
			<div className="flex-columns">
				<div className="flex-columns">
					<div>Platoon</div>
					<div>1st</div>
					<div className="stacked-buttons">
						<Button className="small">Up</Button>
						<Button className="small">Down</Button>
					</div>
				</div>
				<div className="flex-columns">
					<div>Troops</div>
					<div>0</div>
					<div className="stacked-buttons">
						<Button className="small">Up</Button>
						<Button className="small">Down</Button>
					</div>
				</div>
				<div className="flex-columns">
					<div>Civilians</div>
					<div>{civilians}</div>
				</div>
			</div>
			<div className="flex-columns">
				<div className="flex-columns">
					<div>
						<div>Suit Cost: {0}</div>
						<div><img src="" alt="Suit" /></div>
						<div>
							<Button>Previous</Button>
							<Button>Next</Button>
						</div>
					</div>
					<div>
						<div>Cost: {0}</div>
						<div><img src="" alt="Suit" /></div>
						<div>
							<Button>Previous</Button>
							<Button>Next</Button>
						</div>
					</div>
				</div>
				<div>
					<div>
						<label>Location</label> {''}
					</div>
					<div>
						<label>Credits</label> {credits}
					</div>
					<div>
						<label>Rank</label> {rank}
					</div>
					<div>
						{message}
					</div>
					<div>{/*messages*/}</div>
					<div>
						<Button>Equip</Button>
						<Button>Disband</Button>
					</div>
					<div>
						<label>Calibre</label> {calibre}%
					</div>
				</div>
			</div>
		</div>
	)
}

export default Training