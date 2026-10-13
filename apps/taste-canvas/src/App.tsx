import { useState, useCallback, useRef } from 'react'
import { Tldraw, Editor, createShapeId, toRichText } from 'tldraw'

interface SwarmMetricStats {
	totalSeeds?: number
	totalArchetypes?: number
	averageQualityScore?: number
	lastSyncTimestamp?: string
}

export default function App() {
	const editorRef = useRef<Editor | null>(null)
	const [syncing, setSyncing] = useState(false)
	const [statusText, setStatusText] = useState('Edge Swarm Active')
	const [metrics, setMetrics] = useState<SwarmMetricStats>({
		totalSeeds: 12,
		totalArchetypes: 12,
		averageQualityScore: 0.94,
	})

	const buildInitialGraph = useCallback((editor: Editor) => {
		editor.selectAll()
		editor.deleteShapes(editor.getSelectedShapeIds())

		const shapes: any[] = []

		// Central Hub Shape
		shapes.push({
			id: createShapeId('hub-node'),
			type: 'geo',
			x: 600,
			y: 400,
			props: {
				geo: 'rectangle',
				w: 420,
				h: 220,
				color: 'black',
				fill: 'semi',
				richText: toRichText(
					'PIXASSO LIVING TASTE BRAIN\n' +
					'Decentralized Swarm Intelligence\n\n' +
					'• 12 Canonical Design Movements\n' +
					'• Zero-Cost Workers AI & NVIDIA Routing\n' +
					'• Salted SHA-256 Token Consensus\n' +
					'• Continuous Anti-Trope Filtering'
				),
			},
		})

		// Movement Clusters Configuration
		const clusters = [
			{
				id: 'm1-swiss',
				title: 'Swiss International Grotesk',
				color: 'grey',
				x: 100,
				y: 80,
				desc: 'Mathematical 12-column grid, hairlines, pure monochrome contrast (18.2:1), and zero decorative shadows.',
				tokens: 'Type: Syne + Inter + Space Mono\nLayout: 12-Col Rigid Grid\nMotion: 150ms Tactile Snap\nPalette: #FFFFFF, #000000, #E0E0E0',
			},
			{
				id: 'm2-editorial',
				title: 'Warm Editorial Poise',
				color: 'yellow',
				x: 640,
				y: 40,
				desc: 'Archival ivory paper texture, commanding modern serif body, asymmetric quote callouts, wide margin geometry.',
				tokens: 'Type: Newsreader Serif + JetBrains\nLayout: Split-Screen Editorial\nMotion: Soft Page Drift\nPalette: #FBFAF7, #191919, #8C8C82',
			},
			{
				id: 'm3-crt',
				title: 'Retro-Futurist Monospace HUD',
				color: 'green',
				x: 1180,
				y: 80,
				desc: 'Emerald raster glow on cathode black ground, bracket hotkeys, 1px scanline texture, telemetry bento panels.',
				tokens: 'Type: JetBrains Mono + Space Mono\nLayout: Telemetry Bento\nMotion: Scanline Flicker\nPalette: #080B09, #33FF66, #0F381E',
			},
			{
				id: 'm4-neobrutal',
				title: 'Neo-Brutalism & High Contrast',
				color: 'orange',
				x: 1220,
				y: 400,
				desc: 'Raw 2px ink borders, unyielding geometric contrast, vibrant cadmium highlights, zero gradient tropes.',
				tokens: 'Type: Space Grotesk + Archivo\nLayout: Asymmetric Bento\nMotion: Instant State Toggle\nPalette: #E5E5E0, #000000, #FACC15',
			},
			{
				id: 'm5-solarpunk',
				title: 'Bio-Digital Solarpunk',
				color: 'light-green',
				x: 1180,
				y: 740,
				desc: 'Warm stone ground, organic rounded pill contours, earth moss and amber tones, fluid spring physics.',
				tokens: 'Type: Fraunces + Plus Jakarta Sans\nLayout: Fluid Organic Bento\nMotion: Resonant Bell Chime\nPalette: #F4F3EF, #223825, #D97706',
			},
			{
				id: 'm6-glass',
				title: 'Spatial 3D & Liquid Glass',
				color: 'light-blue',
				x: 640,
				y: 760,
				desc: 'Optical glass refraction, visionOS materials, COBE 5kB WebGL globe, dynamic Thinking Orb shader physics.',
				tokens: 'Type: Syne Display + JetBrains\nLayout: Spatial Overlay Viewport\nMotion: 60 FPS Inertial Spin\nPalette: #050608, #38BDF8, #94A3B8',
			},
			{
				id: 'm7-minimal',
				title: 'Minimalist Monochrome',
				color: 'grey',
				x: 100,
				y: 740,
				desc: 'Pure structural restraint, mathematical whitespace scales, zero decorative gradients or purple halos.',
				tokens: 'Type: Inter + Geist Mono\nLayout: 8pt Modular Rhythm\nMotion: Zero Latency Crisp Snap\nPalette: #0A0A0A, #FFFFFF, #262626',
			},
			{
				id: 'm8-cyber',
				title: 'Cybernetic Terminal',
				color: 'red',
				x: 60,
				y: 400,
				desc: 'Amber phosphor CRT console, monospace tabular telemetry, command line ergonomics.',
				tokens: 'Type: Space Mono + Fira Code\nLayout: Dual-Pane HUD\nMotion: Phosphor Decay\nPalette: #120C02, #FFB000, #4A3200',
			},
			{
				id: 'm9-kinetic',
				title: 'Kinetic Variable Typography',
				color: 'violet',
				x: 1620,
				y: 200,
				desc: 'Interactive variable font weight axes responding to velocity, hover acceleration, and layout gravity.',
				tokens: 'Type: Switzer + Editorial Oldstyle\nLayout: Variable Axis Stage\nMotion: Spring Dampening Recoil\nPalette: #18181B, #A855F7, #F4F4F5',
			},
			{
				id: 'm10-destijl',
				title: 'Bauhaus & De Stijl',
				color: 'blue',
				x: 1620,
				y: 600,
				desc: 'Primary color block abstraction, heavy structural dividing lines, absolute non-objective composition.',
				tokens: 'Type: Archivo Black + Inter\nLayout: Asymmetric Primary Grid\nMotion: Linear Step Transition\nPalette: #D11141, #00A0B0, #FFB81C',
			},
			{
				id: 'm11-y2k',
				title: 'Y2K Cyber-Optimism',
				color: 'light-violet',
				x: -360,
				y: 200,
				desc: 'Metallic chrome highlights, iridescent surfaces, playful pill badges, retro-futuristic optimism.',
				tokens: 'Type: Planet Kosmos + Syne\nLayout: Floating Chrome Cards\nMotion: Elastic Gel Bounce\nPalette: #0F172A, #EC4899, #E2E8F0',
			},
			{
				id: 'm12-luxury',
				title: 'Editorial Luxury Monograph',
				color: 'yellow',
				x: -360,
				y: 600,
				desc: 'High-fashion editorial layouts, delicate hairline rules, generous negative space, quiet craftsmanship.',
				tokens: 'Type: Newsreader Display + Switzer\nLayout: Asymmetric Monograph\nMotion: Silent Eased Drift\nPalette: #121214, #E4D5B7, #71717A',
			},
		]

		clusters.forEach((c) => {
			// Geo Card
			shapes.push({
				id: createShapeId(c.id),
				type: 'geo',
				x: c.x,
				y: c.y,
				props: {
					geo: 'rectangle',
					w: 340,
					h: 180,
					color: c.color,
					fill: 'semi',
					richText: toRichText(c.title + '\n\n' + c.desc),
				},
			})

			// Connected Note for Design Tokens
			shapes.push({
				id: createShapeId(c.id + '-tokens'),
				type: 'note',
				x: c.x + 360,
				y: c.y,
				props: {
					color: c.color,
					size: 's',
					richText: toRichText('Aesthetic Tokens:\n\n' + c.tokens),
				},
			})

			// Arrow from Hub to Cluster Card
			shapes.push({
				id: createShapeId('arrow-hub-' + c.id),
				type: 'arrow',
				x: 810,
				y: 510,
				props: {
					start: { x: 0, y: 0 },
					end: { x: (c.x + 170) - 810, y: (c.y + 90) - 510 },
					color: 'grey',
					dash: 'dashed',
				},
			})
		})

		// Anti-Pattern Guardrail Sticky Notes
		const guardrails = [
			{
				id: 'guard-1',
				x: 400,
				y: -180,
				color: 'red',
				text: 'ANTI-SLOP GUARDRAIL\n\nZero Generic Purple Glows\nZero Floating Glass Blobs\nZero Lucide Icon Flooding',
			},
			{
				id: 'guard-2',
				x: 740,
				y: -180,
				color: 'green',
				text: 'CRAFT RULE\n\nConcentric Radii Formula:\nR_inner = R_outer - padding\nEnsures optical curvature alignment',
			},
			{
				id: 'guard-3',
				x: 1080,
				y: -180,
				color: 'light-blue',
				text: 'TYPOGRAPHY RULE\n\nType Hierarchy First:\nHeadline personality → Content geometry → 8pt modular rhythm',
			},
		]

		guardrails.forEach((g) => {
			shapes.push({
				id: createShapeId(g.id),
				type: 'note',
				x: g.x,
				y: g.y,
				props: {
					color: g.color,
					size: 'm',
					richText: toRichText(g.text),
				},
			})
		})

		editor.createShapes(shapes)
		editor.zoomToFit()
	}, [])

	const handleMount = useCallback((appEditor: Editor) => {
		editorRef.current = appEditor
		buildInitialGraph(appEditor)
	}, [buildInitialGraph])

	const handleSync = async () => {
		if (!editorRef.current) return
		setSyncing(true)
		setStatusText('Synchronizing with Cloudflare Edge...')

		try {
			const res = await fetch('https://mcp.pixasso.erebuzzz.tech/taste/brain', {
				headers: { Accept: 'application/json' },
				signal: AbortSignal.timeout(6000),
			})

			if (res.ok) {
				const data = await res.json()
				const stats = data.stats || {}
				setMetrics({
					totalSeeds: stats.totalSeeds || 12,
					totalArchetypes: stats.totalArchetypes || 12,
					averageQualityScore: stats.averageQualityScore || 0.94,
					lastSyncTimestamp: stats.lastSyncTimestamp || new Date().toISOString(),
				})
				setStatusText('Live Edge Swarm Synced (' + (stats.totalSeeds || 12) + ' peer seeds)')

				// Spawn a new verified peer node on the canvas
				const newPeerId = createShapeId('peer-node-' + Date.now())
				editorRef.current.createShapes([
					{
						id: newPeerId,
						type: 'note',
						x: 640 + (Math.random() * 200 - 100),
						y: 240 + (Math.random() * 100 - 50),
						props: {
							color: 'light-green',
							size: 's',
							richText: toRichText(
								'VERIFIED PEER SEED\n' +
								'Anonymized SHA-256 node\n' +
								'Score: ' + (stats.averageQualityScore || '0.96') + ' / 1.0\n' +
								'Status: Opt-in consensus'
							),
						},
					},
				])
			} else {
				setStatusText('Edge Cache Active (Fallback to foundational graph)')
			}
		} catch {
			setStatusText('Offline / Edge Cache Active')
		} finally {
			setSyncing(false)
		}
	}

	const handleReset = () => {
		if (editorRef.current) {
			buildInitialGraph(editorRef.current)
			setStatusText('Foundational Graph Restored')
		}
	}

	const handleZoomFit = () => {
		if (editorRef.current) {
			editorRef.current.zoomToFit()
		}
	}

	return (
		<div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
			{/* Top Floating Control Dock */}
			<header
				style={{
					position: 'absolute',
					top: 16,
					left: 16,
					right: 16,
					zIndex: 1000,
					pointerEvents: 'none',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					flexWrap: 'wrap',
					gap: 12,
				}}
			>
				{/* Brand and Status Pill */}
				<div
					style={{
						pointerEvents: 'auto',
						display: 'inline-flex',
						alignItems: 'center',
						gap: 10,
						padding: '8px 16px',
						borderRadius: 9999,
						background: 'rgba(15, 23, 42, 0.88)',
						backdropFilter: 'blur(16px)',
						border: '1px solid rgba(255, 255, 255, 0.12)',
						color: '#f8fafc',
						fontSize: 13,
						fontWeight: 600,
						boxShadow: '0 8px 32px rgba(0, 0, 0, 0.36)',
					}}
				>
					<span
						style={{
							width: 8,
							height: 8,
							borderRadius: '50%',
							background: syncing ? '#eab308' : '#22c55e',
							boxShadow: syncing ? '0 0 10px #eab308' : '0 0 10px #22c55e',
							display: 'inline-block',
						}}
					/>
					<span style={{ letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: 11, color: '#94a3b8' }}>
						Pixasso
					</span>
					<span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
					<span>Living Taste Brain Canvas</span>
					<span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
					<span style={{ fontSize: 11, color: '#38bdf8', fontFamily: 'monospace' }}>
						{statusText}
					</span>
				</div>

				{/* Action Buttons */}
				<div
					style={{
						pointerEvents: 'auto',
						display: 'inline-flex',
						alignItems: 'center',
						gap: 8,
					}}
				>
					<button
						type="button"
						onClick={handleSync}
						disabled={syncing}
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 6,
							padding: '8px 14px',
							borderRadius: 8,
							background: '#0284c7',
							color: '#ffffff',
							border: 'none',
							fontSize: 12,
							fontWeight: 600,
							cursor: syncing ? 'wait' : 'pointer',
							boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
							transition: 'all 0.15s ease',
						}}
					>
						<span>{syncing ? 'Syncing...' : 'Sync Living Memory'}</span>
					</button>

					<button
						type="button"
						onClick={handleZoomFit}
						style={{
							padding: '8px 12px',
							borderRadius: 8,
							background: 'rgba(15, 23, 42, 0.88)',
							backdropFilter: 'blur(16px)',
							color: '#f8fafc',
							border: '1px solid rgba(255, 255, 255, 0.12)',
							fontSize: 12,
							fontWeight: 600,
							cursor: 'pointer',
						}}
					>
						Zoom to Fit
					</button>

					<button
						type="button"
						onClick={handleReset}
						style={{
							padding: '8px 12px',
							borderRadius: 8,
							background: 'rgba(15, 23, 42, 0.88)',
							backdropFilter: 'blur(16px)',
							color: '#f8fafc',
							border: '1px solid rgba(255, 255, 255, 0.12)',
							fontSize: 12,
							fontWeight: 600,
							cursor: 'pointer',
						}}
					>
						Reset Graph
					</button>

					<a
						href="../../index.html#live-brain"
						style={{
							padding: '8px 14px',
							borderRadius: 8,
							background: 'rgba(255, 255, 255, 0.08)',
							backdropFilter: 'blur(16px)',
							color: '#f8fafc',
							border: '1px solid rgba(255, 255, 255, 0.14)',
							fontSize: 12,
							fontWeight: 600,
							textDecoration: 'none',
							display: 'inline-flex',
							alignItems: 'center',
							gap: 4,
						}}
					>
						<span>Exit to Website</span>
						<span>↗</span>
					</a>
				</div>
			</header>

			{/* Bottom Telemetry Bar */}
			<footer
				style={{
					position: 'absolute',
					bottom: 16,
					left: 16,
					zIndex: 1000,
					pointerEvents: 'none',
				}}
			>
				<div
					style={{
						pointerEvents: 'auto',
						display: 'inline-flex',
						alignItems: 'center',
						gap: 12,
						padding: '6px 14px',
						borderRadius: 6,
						background: 'rgba(15, 23, 42, 0.88)',
						backdropFilter: 'blur(16px)',
						border: '1px solid rgba(255, 255, 255, 0.1)',
						color: '#94a3b8',
						fontSize: 11,
						fontFamily: 'monospace',
					}}
				>
					<span>SEEDS: <strong style={{ color: '#f8fafc' }}>{metrics.totalSeeds}+</strong></span>
					<span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
					<span>MOVEMENTS: <strong style={{ color: '#f8fafc' }}>{metrics.totalArchetypes}</strong></span>
					<span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
					<span>QUALITY: <strong style={{ color: '#f8fafc' }}>{metrics.averageQualityScore} / 1.0</strong></span>
					<span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>|</span>
					<span>DRAG · PAN · DRAW · CONNECT</span>
				</div>
			</footer>

			{/* Main tldraw Infinite Whiteboard */}
			<Tldraw onMount={handleMount} />
		</div>
	)
}
