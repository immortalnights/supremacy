import React, { useReducer } from 'react';
import { useRouter, useMatchmakingRouter } from 'seventh-component-library';
import './App.css';

const Game = (props) => {
	return useRouter({
		routes: {
			'/': id => (<div>solarsystem</div>),
			'/combat/:planet': (id, planet) => (<div>combat {planet}</div>),
			'/dock/:planet': (id, planet) => (<div>dock {planet}</div>),
			'/fleet/:planet': (id, planet) => (<div>fleet {planet}</div>),
			'/overview/:planet': (id, planet) => (<div>overview {planet}</div>),
			'/shipyard/:planet': (id, planet) => (<div>shipyard {planet}</div>),
			'/surface/:planet': (id, planet) => (<div>surface {planet}</div>),
			'/training/:planet': (id, planet) => (<div>training {planet}</div>)
		}
	});
};

function App() {
	const content = useMatchmakingRouter(undefined, undefined, Game);

	return (
		<div>{content}</div>
	);
};

export default App;
