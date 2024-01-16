import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';

import { FormBuilder, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-word-spell',
  templateUrl: './word-spell.component.html',
  styleUrls: ['./word-spell.component.scss']
})
export class WordSpellComponent implements OnInit, OnDestroy, AfterViewInit {


  words: string[] = [];
  wordPos = 0;
  wordGuess = new FormControl('');
  showWord = "";
  errorCount = 0;

  voices: any[] = [];
  selectedVoiceIndex = -1;
  synth!: SpeechSynthesis;

  progress = 0;
  errorMsg: string = "";
  correct = false;


  constructor(private httpClient: HttpClient) {

  }
  

  ngOnInit(): void {
    this.synth = window.speechSynthesis;
    window.speechSynthesis.onvoiceschanged = () => {
      this.voices = window.speechSynthesis.getVoices();
      console.log("this.voices: ", this.voices);
      this.selectedVoiceIndex = 0;
    };

    this.httpClient.get('assets/pdf/Words_of_the_Champions_Printable_FINAL.txt', { responseType: 'text' })
      .subscribe(data => {
        //console.log(data)
        this.words = data.split("\n");
      });

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.askNextWord();  
    }, 1000);
    
  }

  //post = { value: "Hello Beautiful!", language: "en", voiceGender: "male", pitch: 1, rate: 1 }
  askNextWord() {
    console.log("speak .....");
    this.reset();
    let nextWord = this.words[this.wordPos];
    let post = { value: nextWord, language: "en", voiceGender: "male", pitch: 1, rate: 1 }

    this.speak(post);
  }

  reset() {
    this.showWord = "";
    this.errorMsg = "";
    this.correct = false; 
    //this.wordGuess.setValue("");   
  }

  confirm() {
    if (!this.wordGuess.value) return;

    if (this.wordGuess.value.trim().toLowerCase() == this.words[this.wordPos].toLowerCase()) {
      this.showWord = this.words[this.wordPos];
      this.wordPos++;
      this.progress++;  
      this.reset();
      this.correct = true;      
      this.errorCount = 0;  
      this.wordGuess.setValue("");       
    } else {
      this.reset();
      this.errorMsg = "Invalid word";   
      this.errorCount++;   
    }

    if (this.errorCount > 3) {
      this.showWord = this.words[this.wordPos];
      this.wordGuess.setValue(this.showWord);
    }

    
  }


  //post = {value: "Hello Beautiful!", language: "en", voiceGender: "male", pitch: 1, rate: 1}
  speak(post: any) {
    if (this.synth.speaking) {
      console.log("speechSynthesis.speaking");
      return;
    }



    if (post.value !== "") {
      const utterThis = new SpeechSynthesisUtterance(post.value);

      utterThis.onend = (event) => {
        console.info("SpeechSynthesisUtterance.onend");
      };

      utterThis.onerror = (event) => {
        console.error("SpeechSynthesisUtterance.onerror: ", event);
      };

      utterThis.voice = this.voices[this.selectedVoiceIndex];

      utterThis.pitch = post.pitch;
      utterThis.rate = post.rate;
      this.synth.speak(utterThis);

    }
  }


  ngOnDestroy() {
    if (this.synth) this.synth.cancel();
  }





}
