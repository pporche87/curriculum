const HubspotClient = require('hubspot');
const hubspot = new HubspotClient();

hubspot.useKey(process.env.HUBSPOT_API_KEY, (error) => {
  if (error) throw error
});

const Phase = function(){}


const USER_PROPERTIES = {
  // "address",
  // "applicant_status",
  // "aptitude_fit",
  // "assigned_cohort",

  // "cohort_invited",
  // "comments",
  // "createdate",
  // "culture_fit",
  // "current_stage",
  // "currentlyinworkflow",
  // "date_milestone_10_interview_completed",
  // "date_ps_milestone_02_showed_up",
  // "date_ps_milestone_04_withdrew",
  // "days_to_close",
  "email": String,
  "firstname": String,
  "lastname": String,
  "nickname": String,
  "phone": String,
  "cell_phone_number": String,
  "gender": String,
  "race": String,
  "isa_signed": Boolean,
  "lastmodifieddate": Date,
  "learning_facilitator": String,
  "left_at_exit_ramp": String,
  "lifecyclestage": String,
  "living_stipend_isa_signed": Boolean,
  "living_stipend_total": Number,
  "low_income": Boolean,
  "new_laptop_policy_increased_isa_": Boolean,
  // personal days
  "pd_days_remaining": Number,
  "pd_days_used": Number,
  "personal_days": String,
  "personal_days_remaining": Number,
  "phase": Phase,
  "exit_phase": Phase,
  "phase_week": Number,
  "enrollee_start_date": Date,
  "closedate": Date,
  // phase start dates
  "date_phase_1": Date,
  "date_phase_2": Date,
  "date_phase_3": Date,
  "date_phase_4": Date,
  "date_phase_5": Date,
  // phase end dates
  "end_date_phase_1": Date,
  "end_date_phase_2": Date,
  "end_date_phase_3": Date,
  "end_date_phase_4": Date,
  "end_date_phase_5": Date,
  "loa_start_date": String, // Leave of Absence Start Datee
  "phase_1_attempt": String,
  "phase_2_attempt": String,
  "phase_3_attempt": String,
  "phase_4_attempt": String,
  "phase_5_attempt": String,
  "phase_1_interviewer": String,
  "phase_2_interviewer": String,
  "phase_3_interviewer": String,
  "phase_4_interviewer": String,
  "phase_5_interviewer": String,
  "phase_1_interview_outcome": String,
  "phase_2_interview_outcome": String,
  "phase_3_interview_outcome": String,
  "phase_4_interview_outcome": String,
  "phase_5_interview_outcome": String,
  "phase_1_interview_date": Date,
  "phase_1_interview_date_second_": Date,
  "phase_1_interview_date_fourth_attempt_": Date,
  "phase_1_interview_date_third_attempt_": Date,
  "phase_1_interview_date_fifth_attempt_": Date,
  "phase_2_interview_date": Date,
  "phase_2_interview_date_second_": Date,
  "phase_2_interview_date_fourth_attempt_": Date,
  "phase_2_interview_date_third_attempt_": Date,
  "phase_2_interview_date_fifth_attempt_": Date,
  "phase_3_interview_date": Date,
  "phase_3_interview_date_second_": Date,
  "phase_3_interview_date_fourth_attempt_": Date,
  "phase_3_interview_date_third_attempt_": Date,
  "phase_3_interview_date_fifth_attempt_": Date,
  "phase_4_interview_date": Date,
  "phase_4_interview_date_second_": Date,
  "phase_4_interview_date_fourth_attempt_": Date,
  "phase_4_interview_date_third_attempt_": Date,
  "phase_4_interview_date_fifth_attempt_": Date,
  "phase_5_interview_date": Date,
  "phase_5_interview_date_second_": Date,
  "phase_5_interview_date_fourth_attempt_": Date,
  "phase_5_interview_date_third_attempt_": Date,
  "phase_5_interview_date_fifth_attempt_": Date,
  // "re_committed",
  // "sept_ciiaaa_signed",
  // "should_this_candidate_move_on_to_an_enrollment_game_",
  // "showed_up_on_day_1",
  // "signed_up_for_founder_interview",
  // "signed_up_for_interivew",
  // "sorting_interview_artifact",
  // "sorting_interview_completeness",
  // "sorting_interview_date",
  // "sorting_interview_phase",
  // "sorting_interview_video",
  // "sorting_interviewer",
  // "sorting_iv_authenticity",
  // "sorting_iv_challenge_instructions",
  // "sorting_iv_commit_history",
  // "sorting_iv_comprehension",
  // "sorting_iv_feedback_to_learner",
  // "sorting_iv_internal_feedback",
  // "sorting_iv_self_reflection",
  // "sorting_iv_technical_language",
  // "start_date_assigned",
  // "this_aspirant_is_committed_to_becoming_a_software_developer_and_is_a_good_investment_for_lg",
  // "this_candidate_is_one_of_our_learners_",
}


const getAllContacts = (options={}) => {
  return new Promise((resolve, reject) => {
    options.count = options.count || 99999
    options.property = options.property || Object.keys(USER_PROPERTIES)
    hubspot.contacts.get(options, (error, response) => {
      error ? reject(error) : resolve(response.contacts)
    })
  })
}

const getContactByEmail = (email) => {
  return new Promise((resolve, reject) => {
    hubspot.contacts.getByEmail(email, (error, response) => {
      if (error) return reject(error)
      if (response.status === 'error') return reject(new Error(response.message))
      const contact = processContact(response)
      contact.vid = response.vid
      resolve(contact)
    })
  })
}

const getContactsByEmail = emails => {
  return new Promise((resolve, reject) => {
    hubspot.contacts.getByEmailBatch(emails, (error, response) => {
      if (error) return reject(error)
      if (response.status === 'error') return reject(new Error(response.message))
      const contacts = Object.values(response).map(processContact)
      resolve(contacts)
    })
  })
}


const processContact = function(_contact){
  const contact = {}
  contact.vid = _contact.vid
  Object.entries(USER_PROPERTIES).forEach(([propName, propType]) => {
    const prop = _contact.properties[propName]
    if (!prop) {
      contact[propName] = null
      return
    }
    let value = prop.value

    if (propType === String && typeof value !== 'string')
      value = String(value)

    if (propType === Number && typeof value !== 'number')
      value = Number(value)

    if (propType === Boolean && typeof value === 'string')
      value = value === 'true' ? true : value === 'false' ? false : null

    if (propType === Date && !(value instanceof Date))
      value = parseDate(value)

    if (propType === Phase && typeof value !== 'number')
      value = Number.parseInt(value.replace('Phase ',''))

    contact[propName] = value
  })
  return contact
}

const parseDate = input => {
  let date
  if (input.toString().match(/^\d+$/)){
    date = new Date(0)
    date.setUTCSeconds(Number.parseInt(input) / 1000)
    return date
  }
  // throw new TypeError(`bad date: ${input}`)
}



module.exports = {
  getAllContacts,
  getContactByEmail,
  getContactsByEmail
}
