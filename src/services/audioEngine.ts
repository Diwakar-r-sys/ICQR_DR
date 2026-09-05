export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  
  private windGain: GainNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  
  private timers: number[] = [];
  private currentSeason: 'spring' | 'summer' | 'autumn' = 'spring';
  private isMuted: boolean = true;

  public init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const WAContext = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new WAContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.gain.value = 0;

    this.setupWind();
    this.applySeason(this.currentSeason);
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended' && !muted) this.ctx.resume();
    this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.4, this.ctx.currentTime, 0.5);
  }

  public setSeason(season: 'spring' | 'summer' | 'autumn') {
    this.currentSeason = season;
    this.applySeason(season);
  }

  private createBrownNoise() {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 2; 
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; 
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  }

  private setupWind() {
    if (!this.ctx || !this.masterGain) return;
    const noise = this.createBrownNoise();
    if (!noise) return;

    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = 'lowpass';
    
    this.windGain = this.ctx.createGain();
    
    noise.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.masterGain);
    
    noise.start();
  }

  private clearSeasonEffects() {
    this.timers.forEach(clearTimeout);
    this.timers = [];
  }

  private applySeason(season: 'spring' | 'summer' | 'autumn') {
    if (!this.ctx || !this.windFilter || !this.windGain) return;
    this.clearSeasonEffects();

    const now = this.ctx.currentTime;

    if (season === 'spring') {
      this.windFilter.frequency.setTargetAtTime(300, now, 1);
      this.windGain.gain.setTargetAtTime(0.3, now, 1);
      this.playSpringBirds();
    } else if (season === 'summer') {
      this.windFilter.frequency.setTargetAtTime(200, now, 1);
      this.windGain.gain.setTargetAtTime(0.15, now, 1);
      this.playSummerCrickets();
    } else if (season === 'autumn') {
      this.windFilter.frequency.setTargetAtTime(600, now, 1);
      this.windGain.gain.setTargetAtTime(0.6, now, 1);
      this.playAutumnWind();
    }
  }

  private playSpringBirds = () => {
    if (!this.ctx || !this.masterGain) return;
    const playChirp = () => {
      if (this.currentSeason === 'spring' && !this.isMuted) {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        
        osc.type = 'sine';
        const startFreq = 2500 + Math.random() * 1000;
        osc.frequency.setValueAtTime(startFreq, this.ctx!.currentTime);
        osc.frequency.exponentialRampToValueAtTime(startFreq + 600, this.ctx!.currentTime + 0.1);
        osc.frequency.exponentialRampToValueAtTime(startFreq - 400, this.ctx!.currentTime + 0.25);

        gain.gain.setValueAtTime(0, this.ctx!.currentTime);
        gain.gain.linearRampToValueAtTime(0.15, this.ctx!.currentTime + 0.05);
        gain.gain.linearRampToValueAtTime(0, this.ctx!.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        
        osc.start();
        osc.stop(this.ctx!.currentTime + 0.3);
      }
      if (this.currentSeason === 'spring') {
        this.timers.push(window.setTimeout(playChirp, 2000 + Math.random() * 4000));
      }
    };
    this.timers.push(window.setTimeout(playChirp, 1000));
  }

  private playSummerCrickets = () => {
    if (!this.ctx || !this.masterGain) return;
    const playCricket = () => {
      if (this.currentSeason === 'summer' && !this.isMuted) {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(5000 + Math.random() * 500, this.ctx!.currentTime);
        
        gain.gain.setValueAtTime(0, this.ctx!.currentTime);
        for(let i=0; i<4; i++) {
          gain.gain.linearRampToValueAtTime(0.04, this.ctx!.currentTime + i*0.06 + 0.01);
          gain.gain.linearRampToValueAtTime(0, this.ctx!.currentTime + i*0.06 + 0.05);
        }

        osc.connect(gain);
        gain.connect(this.masterGain!);
        
        osc.start();
        osc.stop(this.ctx!.currentTime + 0.25);
      }
      if (this.currentSeason === 'summer') {
        this.timers.push(window.setTimeout(playCricket, 1000 + Math.random() * 2000));
      }
    }
    this.timers.push(window.setTimeout(playCricket, 500));
  }

  private playAutumnWind = () => {
    if (!this.ctx || !this.masterGain || !this.windFilter) return;
    const howl = () => {
      if (this.currentSeason === 'autumn') {
         const now = this.ctx!.currentTime;
         this.windFilter!.frequency.setTargetAtTime(800 + Math.random() * 600, now, 2);
         this.windFilter!.frequency.setTargetAtTime(400, now + 3, 2);
         this.timers.push(window.setTimeout(howl, 4000 + Math.random() * 4000));
      }
    };
    this.timers.push(window.setTimeout(howl, 500));
  }

  public playMagicReveal() {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    // A major pentatonic chord arpeggio
    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51]; 
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const startTime = now + i * 0.08;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 2.5);
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(startTime);
      osc.stop(startTime + 3);
    });
  }
}

export const audioEngine = new AudioEngine();
