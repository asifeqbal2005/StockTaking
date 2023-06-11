export class LookUp {
  Text: string;
  Value: Number;

  constructor(text: string, value: number) {
    this.Text = text;
    this.Value = value;
  }
}

export class LookUps {
  static ParticipantType: LookUp[] =
    [
      new LookUp("Claim Handler", 1),
      new LookUp("Policyholder", 2),
      new LookUp("Handling Organisation", 3),
      new LookUp("Reinsurer", 4),
      new LookUp("DWP", 5)
    ]
}
