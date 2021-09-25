import * as React from 'react'
import io from 'socket.io-client'

type Props = {
	name?: string
}

export const App: React.FC<Props> = ({ name }) => (
	<>
		<h1>
			Hello {name}
		</h1>
	</>
)
