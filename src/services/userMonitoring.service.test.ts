import { UserMonitoringService } from './userMonitoring.service';
import {
  singleWithdrawalUnder100,
  singleWithdrawalOver100,
  singleDepositOver100,
} from '../mocks/singleTransactions';
import {
  transaction1,
  transaction2,
  transaction3,
  transaction4,
  transaction5,
  transaction6,
} from '../mocks/multipleTransactrions';

const userMonitoringService = new UserMonitoringService();

describe('check withdrawal amount', () => {
  let userMonitoringService: UserMonitoringService;

  beforeEach(() => {
    userMonitoringService = new UserMonitoringService();
  });

  it('should return true when it is type withdrawal and amount over 100', () => {
    userMonitoringService.addPayload(singleWithdrawalOver100);
    const payload = userMonitoringService.getAllPayloads();
    const result = userMonitoringService.checkWithdrawalAmount(payload);

    expect(result).toBe(true);
  });

  it('should return false when it is type withdrawal and amount under 100', () => {
    userMonitoringService.addPayload(singleWithdrawalUnder100);
    const payload = userMonitoringService.getAllPayloads();
    const result = userMonitoringService.checkWithdrawalAmount(payload);

    expect(result).toBe(false);
  });

  it('should return false when it is type deposit and amount over 100', () => {
    userMonitoringService.addPayload(singleDepositOver100);
    const payload = userMonitoringService.getAllPayloads();
    const result = userMonitoringService.checkWithdrawalAmount(payload);

    expect(result).toBe(false);
  });
});

describe('check for three consecutive withdrawals', () => {
  let userMonitoringService: UserMonitoringService;

  beforeEach(() => {
    userMonitoringService = new UserMonitoringService();
  });

  it('should return true when there are three consecutive withdrawals', () => {
    userMonitoringService.addPayload(transaction1);
    userMonitoringService.addPayload(transaction2);
    userMonitoringService.addPayload(transaction3);
    userMonitoringService.addPayload(transaction4);
    userMonitoringService.addPayload(transaction5);
    const payload = userMonitoringService.getAllPayloads();
    const result =
      userMonitoringService.checkThreeConsecutiveWithdrawals(payload);

    expect(result).toBe(true);
  });

  it('should return false when there are not three consecutive withdrawals', () => {
    userMonitoringService.addPayload(transaction1);
    userMonitoringService.addPayload(transaction2);
    userMonitoringService.addPayload(transaction3);
    userMonitoringService.addPayload(transaction5);

    const payload = userMonitoringService.getAllPayloads();

    const result =
      userMonitoringService.checkThreeConsecutiveWithdrawals(payload);

    expect(result).toBe(false);
  });
});

describe('check for three deposits getting larger', () => {
  let userMonitoringService: UserMonitoringService;

  beforeEach(() => {
    userMonitoringService = new UserMonitoringService();
  });

  it('should return true when there are three consecutive deposits increasing in size', () => {
    userMonitoringService.addPayload(transaction1);
    userMonitoringService.addPayload(transaction2);
    userMonitoringService.addPayload(transaction3);
    userMonitoringService.addPayload(transaction4);
    userMonitoringService.addPayload(transaction5);
    userMonitoringService.addPayload(transaction6);
    const payloadsArray = userMonitoringService.getAllPayloads();

    const result =
      userMonitoringService.checkThreeDepositsLarger(payloadsArray);

    expect(result).toBe(true);
  });

  it('should return false when there are two consecutive deposits increasing in size', () => {
    userMonitoringService.addPayload(transaction1);
    userMonitoringService.addPayload(transaction2);
    userMonitoringService.addPayload(transaction3);
    userMonitoringService.addPayload(transaction4);
    userMonitoringService.addPayload(transaction5);

    const payloadsArray = userMonitoringService.getAllPayloads();

    const result =
      userMonitoringService.checkThreeDepositsLarger(payloadsArray);

    expect(result).toBe(false);
  });
});

describe('check for deposits totally greater than 200', () => {
  let userMonitoringService: UserMonitoringService;

  beforeEach(() => {
    userMonitoringService = new UserMonitoringService();
  });

  it('should return true when sum of deposits is greater than 200', () => {
    userMonitoringService.addPayload(transaction1);
    userMonitoringService.addPayload(transaction2);
    userMonitoringService.addPayload(transaction3);
    userMonitoringService.addPayload(transaction4);
    userMonitoringService.addPayload(transaction5);
    userMonitoringService.addPayload(transaction6);
    const payloadsArray = userMonitoringService.getAllPayloads();

    const result = userMonitoringService.checkDepositedOver200(payloadsArray);

    expect(result).toBe(true);
  });

  it('should return false when sum of deposits is less than 200', () => {
    userMonitoringService.addPayload(transaction1);
    userMonitoringService.addPayload(transaction2);
    userMonitoringService.addPayload(transaction3);
    userMonitoringService.addPayload(transaction4);
    userMonitoringService.addPayload(transaction5);
    const payloadsArray = userMonitoringService.getAllPayloads();

    const result =
      userMonitoringService.checkThreeDepositsLarger(payloadsArray);

    expect(result).toBe(false);
  });

  it('should return false when there are no deposits', () => {
    userMonitoringService.addPayload(transaction2);
    userMonitoringService.addPayload(transaction3);
    userMonitoringService.addPayload(transaction4);

    const payloadsArray = userMonitoringService.getAllPayloads();

    const result =
      userMonitoringService.checkThreeDepositsLarger(payloadsArray);

    expect(result).toBe(false);
  });
});

describe('get alert', () => {
  let userMonitoringService: UserMonitoringService;

  beforeEach(() => {
    userMonitoringService = new UserMonitoringService();
  });

  it('should return alert code false where there is a single withdrawal under 100', () => {
    const result = userMonitoringService.getAlert(singleWithdrawalUnder100);

    expect(result.alert).toEqual(false);
    expect(result).toEqual({ alert: false, alert_codes: [], user_id: 1 });
  });

  it('should return alert code true where there is a single withdrawal over 100', () => {
    const result = userMonitoringService.getAlert(singleWithdrawalOver100);

    expect(result.alert).toEqual(true);
    expect(result.alert_codes).toStrictEqual([1100]);
    expect(result).toEqual({ alert: true, alert_codes: [1100], user_id: 1 });
  });

  it('should display multiple alert codes when conditions are met', () => {
    userMonitoringService.getAlert(transaction1);
    userMonitoringService.getAlert(transaction2);
    userMonitoringService.getAlert(transaction3);
    userMonitoringService.getAlert(transaction4);
    userMonitoringService.getAlert(transaction5);
    const result = userMonitoringService.getAlert(transaction6);
    expect(result).toEqual({
      alert: true,
      alert_codes: [1100, 30, 300],
      user_id: 1,
    });
  });
});
