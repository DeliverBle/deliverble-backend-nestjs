import { Column } from 'typeorm';

export class Time {
  constructor(private _seconds: number, private _milliseconds: number) {
    this.seconds = _seconds;
    this.milliseconds = _milliseconds;
  }

  @Column({ type: 'integer' })
  seconds!: number;

  @Column({ type: 'integer' })
  milliseconds!: number;

  static toNumber(_time: Time): number {
    return Number(parseFloat(_time.seconds.toString())
                  .toFixed(2))
          + Number(parseFloat((_time.milliseconds / 100)
                  .toFixed(2))
    );
  }
}
