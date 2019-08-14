import { SeatSwapPage } from './app.po';

describe('seat-swap App', () => {
  let page: SeatSwapPage;

  beforeEach(() => {
    page = new SeatSwapPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
