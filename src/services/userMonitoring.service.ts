type UserDetails = {
  type: string;
  amount: string;
  user_id: number;
  time: number;
};

type AlertResponse = {
  alert: boolean | undefined;
  alert_codes: Array<number>;
  user_id: number;
};

let alert_codes: any = [];

export class UserMonitoringService {
  private payloads: UserDetails[] = [];

  public addPayload(payload: UserDetails): void {
    this.payloads.push(payload);
  }

  public getAllPayloads(): UserDetails[] {
    return this.payloads;
  }

  public checkWithdrawalAmount(userDetails: Array<UserDetails>): boolean {
    for (const userDetail of userDetails) {
      const amountNumber = Number(userDetail.amount);
      if (userDetail.type === 'withdrawal' && amountNumber > 100) {
        return true;
      }
    }
    return false;
  }

  public checkThreeConsecutiveWithdrawals(
    userDetails: Array<UserDetails>
  ): boolean {
    for (let i = 0; i < userDetails.length - 2; i++) {
      if (
        userDetails[i].type === 'withdrawal' &&
        userDetails[i + 1].type === 'withdrawal' &&
        userDetails[i + 2].type === 'withdrawal'
      ) {
        return true;
      }
    }
    return false;
  }

  public checkThreeDepositsLarger(userDetails: Array<UserDetails>): boolean {
    const filteredUserDetails = userDetails.filter(
      (userDetail) => userDetail.type === 'deposit'
    );
    for (let i = 0; i < filteredUserDetails.length - 2; i++) {
      const firstNumber = Number(filteredUserDetails[i].amount);
      const secondNumber = Number(filteredUserDetails[i + 1].amount);
      const thirdNumber = Number(filteredUserDetails[i + 2].amount);
      if (firstNumber < secondNumber && secondNumber < thirdNumber) {
        return true;
      }
    }
    return false;
  }

  public checkDepositedOver200(userDetails: Array<UserDetails>): boolean {
    let depositedAmounts: Array<number> = [];
    for (let i = 0; i < userDetails.length; i++) {
      if (userDetails[i].type === 'deposit') {
        depositedAmounts.push(Number(userDetails[i].amount));
      }
      let sumDeposits: number = 0;
      for (let j = 0; j < depositedAmounts.length; j++) {
        sumDeposits += depositedAmounts[j];
      }
      if (sumDeposits > 200) {
        return true;
      }
    }
    return false;
  }

  private removeDuplicates(alertCodesArray: Array<number>) {
    return alertCodesArray.filter(
      (value, index) => alertCodesArray.indexOf(value) === index
    );
  }

  public getAlert(userDetails: UserDetails): AlertResponse {
    this.addPayload(userDetails);
    const userDetailsArray = this.getAllPayloads();

    let alertBoolean;
    const withdrawalAmountBoolean =
      this.checkWithdrawalAmount(userDetailsArray);
    const withdrawalsAlertBoolean =
      this.checkThreeConsecutiveWithdrawals(userDetailsArray);
    const depositsLargerBoolean =
      this.checkThreeDepositsLarger(userDetailsArray);

    if (withdrawalAmountBoolean) {
      alert_codes.push(1100);
    }
    if (withdrawalsAlertBoolean) {
      alert_codes.push(30);
    }
    if (depositsLargerBoolean) {
      alert_codes.push(300);
    }

    const filteredAlertCodes = this.removeDuplicates(alert_codes);

    if (
      withdrawalAmountBoolean ||
      withdrawalsAlertBoolean ||
      depositsLargerBoolean
    ) {
      alertBoolean = true;
    } else {
      alertBoolean = false;
    }

    return {
      user_id: userDetailsArray[0].user_id,
      alert: alertBoolean,
      alert_codes: filteredAlertCodes,
    };
  }
}
