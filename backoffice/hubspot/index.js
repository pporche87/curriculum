const HubspotClient = require('hubspot');
const hubspot = new HubspotClient();

hubspot.useKey(process.env.HUBSPOT_API_KEY, (error) => {
  if (error) throw error
});

const USER_PROPERTIES = [
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
  "email",
  "firstname",
  "lastname",
  "nickname",
  "phone",
  "cell_phone_number",
  "gender",
  "race",

  "isa_signed",
  "lastmodifieddate",
  "learning_facilitator",
  "left_at_exit_ramp",
  "lifecyclestage",
  "living_stipend_isa_signed",
  "living_stipend_total",
  "low_income",
  "new_laptop_policy_increased_isa_",


  // personal days
  "pd_days_remaining",
  "pd_days_used",
  "personal_days",
  "personal_days_remaining",

  "phase",
  "exit_phase",
  "phase_week",

  "enrollee_start_date",
  "closedate",

  // phase start dates
  "date_phase_1",
  "date_phase_2",
  "date_phase_3",
  "date_phase_4",
  "date_phase_5",

  // phase end dates
  "end_date_phase_1",
  "end_date_phase_2",
  "end_date_phase_3",
  "end_date_phase_4",
  "end_date_phase_5",

  "loa_start_date", // Leave of Absence Start Date

  "phase_1_attempt",
  "phase_2_attempt",
  "phase_3_attempt",
  "phase_4_attempt",
  "phase_5_attempt",
  "phase_1_interviewer",
  "phase_2_interviewer",
  "phase_3_interviewer",
  "phase_4_interviewer",
  "phase_5_interviewer",

  "phase_1_interview_outcome",
  "phase_2_interview_outcome",
  "phase_3_interview_outcome",
  "phase_4_interview_outcome",
  "phase_5_interview_outcome",

  "phase_1_interview_date",
  "phase_1_interview_date_second_",
  "phase_1_interview_date_fourth_attempt_",
  "phase_1_interview_date_third_attempt_",
  "phase_1_interview_date_fifth_attempt_",

  "phase_2_interview_date",
  "phase_2_interview_date_second_",
  "phase_2_interview_date_fourth_attempt_",
  "phase_2_interview_date_third_attempt_",
  "phase_2_interview_date_fifth_attempt_",

  "phase_3_interview_date",
  "phase_3_interview_date_second_",
  "phase_3_interview_date_fourth_attempt_",
  "phase_3_interview_date_third_attempt_",
  "phase_3_interview_date_fifth_attempt_",

  "phase_4_interview_date",
  "phase_4_interview_date_second_",
  "phase_4_interview_date_fourth_attempt_",
  "phase_4_interview_date_third_attempt_",
  "phase_4_interview_date_fifth_attempt_",

  "phase_5_interview_date",
  "phase_5_interview_date_second_",
  "phase_5_interview_date_fourth_attempt_",
  "phase_5_interview_date_third_attempt_",
  "phase_5_interview_date_fifth_attempt_",


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
]

const BOOLEAN_USER_PROPERTIES = [
  'isa_signed',
  'new_laptop_policy_increased_isa_',
  'living_stipend_isa_signed',
]

const getAllContacts = (options={}) => {
  return new Promise((resolve, reject) => {
    options.count = options.count || 99999
    options.property = options.property || USER_PROPERTIES.slice()
    hubspot.contacts.get(options, (error, response) => {
      error ? reject(error) : resolve(response.contacts)
    })
  })
}


const getContactByEmail = (email) => {
  return new Promise((resolve, reject) => {
    hubspot.contacts.getByEmail(email, (error, response) => {
      if (error) return reject(error)
      if (response.status === 'error') return reject(response.message)

      const contact = {
        vid: response.vid,
      }

      USER_PROPERTIES.forEach(propName => {
        const prop = response.properties[propName]
        contact[propName] = prop ? prop.value : null
      })

      if (typeof(contact.exit_phase) === 'string'){
        contact.exit_phase = Number.parseInt(contact.exit_phase.replace('Phase ',''))
      }

      if (typeof(contact.phase) === 'string'){
        contact.phase = Number.parseInt(contact.phase.replace('Phase ',''))
      }


      BOOLEAN_USER_PROPERTIES.forEach(property => {
        if (contact[property] === 'true') contact[property] = true
        if (contact[property] === 'false') contact[property] = false
      })

      resolve(contact)
    })
  })
}

module.exports = {
  getAllContacts,
  getContactByEmail,
}
