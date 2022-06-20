/* Autor: Jonathan Hüls*/
class Validator {
  validateUuidv4(id: string): boolean {
    const regexp = new RegExp('^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$', 'i'); //Regex vor UuidV4 lo
    //check Id
    return regexp.test(id);
  }
  validateMultipleUuidv4(...Ids: string[]): boolean {
    //check for values
    if (Ids.length === 0) return false;
    //check Ids
    let result = true;
    Ids.forEach(id => {
      if (!this.validateUuidv4(id)) {
        result = false;
      }
    });

    return result;
  }

  validateUserInput(text: string): boolean {
    const regexp = new RegExp('^[0-9a-zA-Z!?, -_.:#*äÄöÖüÜ]*$', 'g');
    return regexp.test(text);
  }
}

export const validatorService = new Validator();
