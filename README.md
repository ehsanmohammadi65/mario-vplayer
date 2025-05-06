# Vue 3 Video Player

A responsive video player + add Title video component for Vue 3 

## Installation

```bash
npm install mario-vplayer
```

## Usage

1. Import the component:

```javascript
import { VideoPlayer } from 'mario-vplayer'
import 'mario-vplayer/dist/mario-vplayer.css'

export default {
  components: {
    VideoPlayer
  }
}
```

3. Use in your template:

```vue
<VideoPlayer 
  video="/path/to/video.mp4"
  code="VID-123"

/>
```

## Props

| Prop  | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| video | String | Yes | - | Video source URL |
| code  | String | No | - | Display code |
