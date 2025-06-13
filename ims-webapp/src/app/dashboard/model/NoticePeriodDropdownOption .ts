export class NoticePeroidDropdownOption {
    constructor(public value: number, public label: string) {}

    static getDefaultOptions(): NoticePeroidDropdownOption[] {
      return [
        new NoticePeroidDropdownOption(0, '0'),
        new NoticePeroidDropdownOption(15, '15'),
        new NoticePeroidDropdownOption(30, '30'),
        new NoticePeroidDropdownOption(45, '45'),
        new NoticePeroidDropdownOption(60, '60'),
        new NoticePeroidDropdownOption(75, '75'),
        new NoticePeroidDropdownOption(90, '90')
      ];
    }
  }
